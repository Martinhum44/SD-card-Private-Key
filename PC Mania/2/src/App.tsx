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

type NFT = any

type Listing = {
	bought: boolean,
	listId: number,
	lister: string,
	nftBase: NFT,
	nftId: number,
	price: number
}

const App:React.FC = () => {
  const [contract, setContract] = useState<any | null>(null)
  const [account, setAccount] = useState<null | string>(null)
  const [listings, setListings] = useState<Listing[]>([])

  return (
    <>
      <ConnectWallet contractAddress="0xBFA57539d8B70b20CCe7F32B08a45815C04AA04D" contractABI={ABI} callback={async(a ,c)=>{
        setAccount(a); 
        setContract(c);
		const count = (await getValue("countReturn", c))
		console.log(count)
		for(let i = 0; i < count[1]; i++){
			let ls = await getValue("listee", c, [i])
			setListings(l => [...l, ls])
			console.log(ls)
		}
      }} handleChange={(a:string) => setAccount(a)}/>
      {contract != null ? <div id="lists" style={{width: "80%", height: "500px", backgroundColor: "#CDCCCD", overflowY: "scroll", borderRadius: "20px"}}>
	  	{listings.map(l => {
			let URI: "bafkreibu3wr27qrwu42jvxe2qbhbxznxup4tc7oszp5d2btwgsyu2akmp4" | "bafkreihfwu3vhs34gz6bfxh7spoazwjrk7wnpsuvs23id6tpbfexqbacd4" | "bafkreidjnya5xog3fww2shsals5byp422ntprfxlgpebfajpn6argzxlge" | "bafkreicibvdeh74lnz7f4igwksnqx3655knmqaplidqflg5pevxgkgqed" = "bafkreibu3wr27qrwu42jvxe2qbhbxznxup4tc7oszp5d2btwgsyu2akmp4"
			if(l.nftBase.NS = 0){
				URI = "bafkreibu3wr27qrwu42jvxe2qbhbxznxup4tc7oszp5d2btwgsyu2akmp4"
			} else if (l.nftBase.NS == 1){
				URI = "bafkreihfwu3vhs34gz6bfxh7spoazwjrk7wnpsuvs23id6tpbfexqbacd4"
			} else if (l.nftBase.NS == 2){
				URI = "bafkreidjnya5xog3fww2shsals5byp422ntprfxlgpebfajpn6argzxlge"
			} else if (l.nftBase.NS == 3){
				URI = "bafkreicibvdeh74lnz7f4igwksnqx3655knmqaplidqflg5pevxgkgqed"
			}
			return !l.bought ? <div style={{borderRadius: "10px", height:"100px", width:"100px"}}><img src={`https://cloudflare-ipfs.com/ipfs/${URI}}`}/></div> : ""
		})}
      </div> : <h1>You must sign in with your web3 wallet to see the available listings.</h1>}
    </>
  )
}

export default App
