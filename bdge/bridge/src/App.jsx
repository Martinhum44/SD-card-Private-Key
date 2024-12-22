import react, { useState, useEffect } from 'react'
import {Web3} from "web3"
import './App.css'
import "./ConnectWallet"
import ConnectWallet from './ConnectWallet'
import getValue from "./getValue"
import Web3Button from './Web3Button'
import {io} from "socket.io-client"

function App() {
  const [chainID, setChainID] = useState()
  const [account, setAccount] = useState()
  const [contract, setContract] = useState() 
  const [balance, setBalance] = useState(0)
  const [toBridge, setToBridge] = useState(0)
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
      "inputs": [],
      "name": "admin",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "asset",
      "outputs": [
        {
          "internalType": "contract ERC20",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
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
  ]
  const TABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_symbol",
          "type": "string"
        }
      ],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
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
      "name": "burn",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ethAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "manager",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
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
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "multiplied",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nmees",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symb",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tokenAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalsupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]
  const inputStyles = {
    width: "200px",
    border: "none",
    fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif",
    height: "50px",
    margin: "0",
    borderRadius: "10px",
    fontSize: "20px",
    backgroundColor: "#d5d2cd",
    display: "inline",
    marginBottom: "10px"
  }
  const sep = new Web3("https://sepolia.infura.io/v3/e75fd4a10c754b8ea955c6f9a3d71466")
  const hol = new Web3("https://holesky.infura.io/v3/e75fd4a10c754b8ea955c6f9a3d71466")
  const socket = io("http://localhost:3000")

  useEffect(() => {
    async function f(){
      setBalance(((await getValue("balanceOf", String(chainID) == "11155111" ? sepC  : holC, [account]))))
    }
    f()
  })

  socket.on("bridge",(event) => {
    console.log("bridge")
    const {amount, chain} = event
    setBalance(b => b - amount)
    alert(`Successfully bridged ${amount} tokens to chain ${chain}`)
  })

  socket.on("error", (event) => {
    console.log("error")
    const {msg} = event
    alert(msg)
  })

  const sepC = new sep.eth.Contract(TABI, "0x2f5BC9E77271600be71FCB0B2Aa4EB184388d1a9")
  const holC = new hol.eth.Contract(TABI, "0x1761132fe8c16453b62A27fC75ddF71B38e38dEA")
  return (
    <>
      <ConnectWallet contractABI={ABI} contractAddress={String(chainID) == "11155111" ? "0xaC67A472ac3674F7Ad619dD7096507cA87FA3EE5" : "0x20e0fBe44bF68E00A42D4b34fad5dE836dF1C440"} changeChainCallback={async(chain, newContract) => {setChainID(await chain); setContract(newContract); console.log(await chain)}} callback={(acc, cont) => {setAccount(acc); setContract(cont)}} handleChange={(acc) => setAccount(acc)}/>
      
      <div style={{display: account != undefined ? "block" : "none"}}>
        <h1>Connected to chain {String(chainID) == "11155111" ? "Sepolia" : "Holesky" }</h1>
        <h2>{String((balance == NaN ? "Loading... ":Number(balance)/10**18).toFixed(5))} BridgeCoin</h2>
        <input value={toBridge} style={inputStyles} onChange={(e) => setToBridge(e.target.value)}/>
        <div style={{display: (toBridge*10**18 < Number(balance)) && (toBridge != 0 || toBridge) ? "block" : "none"}}>
          <Web3Button contract={contract} address={account} function="burn" text="Bridge" callback={() => console.log("h")}  params={[toBridge*10**18]}/>
        </div>
        <h3 style={{color:"red", display: toBridge*10**18 > Number(balance) ? "block" : "none"}}>Not Enough Funds</h3>
      </div>
    </>
  )
}

export default App
