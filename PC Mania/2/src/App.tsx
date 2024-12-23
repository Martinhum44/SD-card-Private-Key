import { useState, useRef, useEffect } from 'react'
import './App.css'
import ConnectWallet from './ConnectWallet'
import Web3Button from './Web3Button'
import React from 'react'
import Web3 from "web3"
import getValue from './getValue'

const ABI = [
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
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
				"name": "nftId",
				"type": "uint256"
			}
		],
		"name": "Broken",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "listId",
				"type": "uint256"
			}
		],
		"name": "buyNFT",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "craft",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "listNFT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "transToSomeones",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "thenWhos",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "typess",
				"type": "uint256"
			}
		],
		"name": "mintNFTExternal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
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
				"name": "random",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "nftId",
				"type": "uint256"
			}
		],
		"name": "Open",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "openNFT",
		"outputs": [
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
		"inputs": [
			{
				"internalType": "bool",
				"name": "transToSomeones",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "thenWhos",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "typess",
				"type": "uint256"
			}
		],
		"name": "regMintNFT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "repairNFT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "nftID",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "stakeNFT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
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
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
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
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "nftID",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "UnlistNFT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
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
				"name": "random",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "nftId",
				"type": "uint256"
			}
		],
		"name": "Unstake",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "unstakeNFT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "upgradeNFT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
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
		"inputs": [],
		"name": "blocktimestamp",
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
		"name": "countReturn",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
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
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
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
				"name": "_owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "listee",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bool",
						"name": "listed",
						"type": "bool"
					},
					{
						"internalType": "enum nftTime.nftStati",
						"name": "NS",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "level",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "xp",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "staked",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "time4stake",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "URI",
						"type": "string"
					},
					{
						"internalType": "int256",
						"name": "condition",
						"type": "int256"
					}
				],
				"internalType": "struct nftTime.nftI",
				"name": "nftBase",
				"type": "tuple"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "bought",
				"type": "bool"
			},
			{
				"internalType": "address payable",
				"name": "lister",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "nftId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "listId",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "mine",
		"outputs": [
			{
				"internalType": "contract MineCoin",
				"name": "",
				"type": "address"
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
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
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
				"internalType": "uint256",
				"name": "start",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "finish",
				"type": "uint256"
			}
		],
		"name": "randomNumber",
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
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "pure",
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
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "idOfList",
				"type": "uint256"
			}
		],
		"name": "viewList",
		"outputs": [
			{
				"components": [
					{
						"components": [
							{
								"internalType": "bool",
								"name": "listed",
								"type": "bool"
							},
							{
								"internalType": "enum nftTime.nftStati",
								"name": "NS",
								"type": "uint8"
							},
							{
								"internalType": "uint256",
								"name": "level",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "xp",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "id",
								"type": "uint256"
							},
							{
								"internalType": "bool",
								"name": "staked",
								"type": "bool"
							},
							{
								"internalType": "uint256",
								"name": "time4stake",
								"type": "uint256"
							},
							{
								"internalType": "address",
								"name": "owner",
								"type": "address"
							},
							{
								"internalType": "string",
								"name": "URI",
								"type": "string"
							},
							{
								"internalType": "int256",
								"name": "condition",
								"type": "int256"
							}
						],
						"internalType": "struct nftTime.nftI",
						"name": "nftBase",
						"type": "tuple"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "bought",
						"type": "bool"
					},
					{
						"internalType": "address payable",
						"name": "lister",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "nftId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "listId",
						"type": "uint256"
					}
				],
				"internalType": "struct nftTime.list",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "viewNFT",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bool",
						"name": "listed",
						"type": "bool"
					},
					{
						"internalType": "enum nftTime.nftStati",
						"name": "NS",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "level",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "xp",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "staked",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "time4stake",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "URI",
						"type": "string"
					},
					{
						"internalType": "int256",
						"name": "condition",
						"type": "int256"
					}
				],
				"internalType": "struct nftTime.nftI",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "viewOwner",
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
		"name": "wire",
		"outputs": [
			{
				"internalType": "contract WIRE",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

type NFTPhoto = "box.png" | "potato.png" | "cool.png" | "gold.png"
type NFT = {
	listed: boolean
	NS: number
	xp: number, 
	level: number
	id: number
	staked: boolean
	time4stake: number
	owner: string
	condition: number
	URI: string
}

type Listing = {
	bought: boolean,
	listId: number,
	lister: string,
	nftBase: NFT,
	nftId: number,
	price: number
}

const h1Styles = {fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif"}

const App:React.FC = () => {
  const [contract, setContract] = useState<any | null>(null)
  const [account, setAccount] = useState<null | string>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [state, setState] = useState<"shop" | "buying">("shop")
  const [currentListing, setCurrentListing] = useState<Listing>()

  function photoReturn(l: Listing | undefined): NFTPhoto {
	if(l == undefined){
		return "box.png"
	}
	if(l.nftBase.NS == 3){
		return "gold.png"
	} else if (l.nftBase.NS == 2){
		return "cool.png"
	} else if (l.nftBase.NS == 1){
		return "potato.png"
	} else {
		return "box.png"
	}
  }

  function generatePCName(n: NFT | undefined): "PC Box" | "Potato PC" | "Cool PC" | "Gold PC" {
	if(n == undefined){
		return "PC Box"
	}
	if(n.NS == 1){
		return "Potato PC"
	} else if (n.NS == 2){
		return "Cool PC"
	} else if (n.NS == 3){
		return "Gold PC"
	} else {
		return "Potato PC"
	}
  }

  return (
	<>
    <div style={{display: state == "shop" ? "block" : "none"}}>
		<h1 style={h1Styles}>PC Mania</h1>
      <ConnectWallet contractAddress="0xBFA57539d8B70b20CCe7F32B08a45815C04AA04D" contractABI={ABI} callback={async(a ,c)=>{
        setAccount(a); 
        setContract(c);
		const count = (await getValue("countReturn", c))
		console.log(count)
		const newListings: Listing[] = []
		for(let i = 0; i < count[1]; i++){
			let ls = await getValue("listee", c, [i])
			newListings.push(ls)
		}
		console.log(newListings)
		setListings(newListings)
      }} handleChange={(a:string) => setAccount(a)}/>
      {contract != null ? <div id="lists" style={{width: "80%", height: "500px", backgroundColor: "#CDCCCD", overflowY: "scroll", borderRadius: "20px", display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "15px", paddingTop: "20px", paddingLeft: "20px", paddingBottom: "20px"}}>
	  	{listings.map(l => {
			let URI: NFTPhoto = photoReturn(l)
			return !l.bought ? <div style={{borderRadius: "10px", height:"200px", width:"150px", backgroundColor: "#909190"}} onMouseOver={(event) => event.currentTarget.style.backgroundColor = "#B6B6B6"}
			onMouseOut={(event) => event.currentTarget.style.backgroundColor = "#909190"}
			onClick={() => {
				setState("buying")
				setCurrentListing(listings[l.listId])
			}}
			>
				<img src={URI} style={{backgroundColor: "white", marginTop: "5px", borderRadius: "100%"}}/>
				<h5 style={h1Styles}>Cost: {Number(l.price)/1000000000/1000000000} ETH</h5>
				<h6 style={h1Styles}>NFT id: {Number(l.nftId)}</h6>
			</div> : ""
		})}
      </div> : <h1 style={h1Styles}>You must sign in with your web3 wallet to see the available listings.</h1>}
    </div>

	<div style={{display: state == "buying" ? "block" : "none", padding: "0", alignItems: "center"}}>
		<div style={{display: "grid", gridTemplateColumns: "4fr 6fr"}}>
			<div>
				<img src={photoReturn(currentListing)} style={{ marginTop: "5px", borderRadius: "20px", height: "600px", width: "90%", backgroundColor: "lightgray"}}/>
			</div>
			<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
				<div style={{backgroundColor: "#EEEEEE",height: "300px",width: "80%",borderRadius: "20px"}}>
					<h1 style={h1Styles}>{generatePCName(currentListing?.nftBase)}</h1>
					<h3 style={h1Styles}>Lister: {currentListing?.lister}</h3>
					<h3 style={{...h1Styles, display: currentListing?.nftBase.NS == 0 ? "none" : "block"}}>Condition: {Number(currentListing?.nftBase.condition)} / {currentListing?.nftBase.NS == 3 ? 150 : (currentListing?.nftBase.NS == 2 ? 125 : 100)}</h3>
					<Web3Button contract={contract} value={currentListing?.price} callback={/* */} function={/* */} address={String(account)}/>
				</div>
			</div>
		</div>
	</div>
	</>
  )
}

export default App
