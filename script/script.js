const { ethers } = require("ethers");
const { Web3 } = require("web3")
const path = require("path")
const express = require("express");
const sio = require("socket.io")
const http = require('http');

const app = express()
const server = http.createServer(app)
const io = sio(server,
	 {
    cors: {
        origin: "http://localhost:5173", // replace with your client's URL
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true // if you need to send cookies or authorization headers
    }
}
)

const Web3ProviderS = new Web3("https://sepolia.infura.io/v3/e75fd4a10c754b8ea955c6f9a3d71466");
const Web3ProviderH = new Web3("https://holesky.infura.io/v3/e75fd4a10c754b8ea955c6f9a3d71466");
const providerH = new ethers.JsonRpcProvider("https://holesky.infura.io/v3/e75fd4a10c754b8ea955c6f9a3d71466");
const providerS = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/e75fd4a10c754b8ea955c6f9a3d71466");

const priv = "0x0fe1723438b1b52f5bb21fc6991bd3394e3b06d888d8195b8a288a40cd004777";
const addr = "0xad0b0842dFC80b1E806e2389A7f5e098A36E9531"
app.use("/src",express.static("./src"))
const walletH = Web3ProviderH.eth.accounts.privateKeyToAccount(priv)
const walletS = Web3ProviderS.eth.accounts.privateKeyToAccount(priv)

const ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_admin",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "who",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "BridgeEvent",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "burn",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "who",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const HContL = new ethers.Contract("0x20e0fBe44bF68E00A42D4b34fad5dE836dF1C440", ABI, providerH)
const SContP = new Web3ProviderS.eth.Contract(ABI, "0xaC67A472ac3674F7Ad619dD7096507cA87FA3EE5")
const SContL = new ethers.Contract("0xaC67A472ac3674F7Ad619dD7096507cA87FA3EE5", ABI, providerS)
const HContP = new Web3ProviderH.eth.Contract(ABI, "0x20e0fBe44bF68E00A42D4b34fad5dE836dF1C440")

var queue = []

HContL.on("BridgeEvent",async(who, amount) => {
	var tx = SContP.methods.mint(who, amount.toString()).encodeABI()
	tx = { from: addr, data: tx, to: "0xaC67A472ac3674F7Ad619dD7096507cA87FA3EE5", gas: 2000000, gasPrice: 1074302992158000000n }
	queue.push(tx) 
	console.log("EVENT H: ", who, amount.toString())
	console.log(queue)
})

SContL.on("BridgeEvent", async (who, amount) => {
	console.log("EVENT S: ", who, amount.toString())
	var tx = HContP.methods.mint(who, amount.toString()).encodeABI()
	tx = { from: addr, data: tx, to: "0x20e0fBe44bF68E00A42D4b34fad5dE836dF1C440", gas: 2000000, gasPrice: await Web3ProviderH.eth.getGasPrice() }
	queue.push(tx)
	console.log(queue)
})

async function processTxs(){
	while (true){
		if (queue.length === 0){
			await new Promise(resolve => setTimeout(resolve, 1000))
			continue
		}

		const tx = queue.shift()

		try{
			if(tx.to == "0xaC67A472ac3674F7Ad619dD7096507cA87FA3EE5"){
				const signedTx = await walletS.signTransaction(tx)
				await Web3ProviderS.eth.sendSignedTransaction(signedTx.rawTransaction)
				console.log("CONFIRMED")
				io.emit("bridge", {amount: amount, chain: "Holesky"})
			} else if(tx.to == "0x20e0fBe44bF68E00A42D4b34fad5dE836dF1C440"){
				const signedTx = await walletH.signTransaction(tx)
				await Web3ProviderH.eth.sendSignedTransaction(signedTx.rawTransaction)
				console.log("CONFIRMED")
				io.emit("bridge", {amount: amount, chain: "Sepolia"})
			}
			console.log("CONFIRMED")
		} catch(e){
			io.emit("error", {msg: "There was an error, you lost your funds :(. Email us at martingomezmartinezostos@gmail.com with a screenshot of this to recover your funds."})
			console.log("ERROR: "+e)
		}
	}
}

processTxs()

server.listen(3000, () => console.log(__dirname))