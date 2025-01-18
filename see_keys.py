import os
import time
import sys
from web3 import Web3
from Crypto.Cipher import AES
from web3 import Web3
from ecdsa import SECP256k1
import ecdsa
import subprocess

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))
commands = ["view_address", "help", "init", "get_balance", "view_private_key", "send_simple_transaction"]

def init():
    print("Creating an ethereum node... (init first) commands will be available.")
    subprocess.run(["geth", "--holesky", "--http", "--http.api", "eth,net,web3"])
    print("Node closed. (init first) commands aren't avilable anymore.")

def view_details(private_key_number: int):
    IV, PKH = ("".encode(),"".encode())
    try:
        with open(f"IV{private_key_number}.bin", "rb") as f:
            IV = f.read()
        with open(f"PKH{private_key_number}.bin", "rb") as f:
            PKH = f.read()
    except FileNotFoundError:
        pass
    try:
        with open(f"PK{private_key_number}.bin", "rb") as f:
            PK = f.read()
    except FileNotFoundError:
        print(f"The account file you're looking for (PK{private_key_number}.bin), does not exist")
        return(False, False)

    with open("withenc.bin", "rb") as f:
        file = f.read()
        a = file == bytes([1])
        if a:
            print("You used a password to encrypt your private keys and addresses. ")
            password = input("Password: ")
            decrypt = AES.new((Web3.keccak(password.encode())), AES.MODE_CBC, IV)
            PK = decrypt.decrypt(PK)
        else:
            PKH = Web3.keccak(PK)
    
    if PKH == Web3.keccak(PK):
        sk = ecdsa.SigningKey.from_string(PK, curve=SECP256k1)
        PubKeyHash = Web3.keccak(bytes(sk.get_verifying_key().to_string()))
        addressBytes = PubKeyHash[len(PubKeyHash)-20:]
        address = addressBytes.hex()
        return(PK.hex(), address)
    else: 
        print("Invalid password. Data not usable.")
        print(f"Expected hash: {PKH.hex()}.\nHashed private key result: {Web3.keccak(PK).hex()}")
        return(False, False)

def view_address(private_key_number):
    vd = view_details(private_key_number)[1]
    if vd == False:
        return
    print(f"ADDRESS: {vd}")

def view_private_key(private_key_number):
    vd = view_details(private_key_number)[0]
    if  vd == False:
        return
    print(f"PRIVATE KEY: {vd}")

def is_connected() -> bool:
    return w3.is_connected()

def view_balance(private_key_number):
    if is_connected():
        address = view_details(private_key_number)[1]
        if address == False:
            return
        print(f"Balance: {w3.eth.get_balance(w3.to_checksum_address(address))/10**18} ETH")
    else:
        print("Please run the init command before running (init first) commands.")

def send_simple_transaction(private_key_number, to, value):
        if not is_connected():
            return print("Please run the init command before running (init first) commands.")
        
        print("Processing the transaction...")
        VD = view_details(private_key_number)
        PK = VD[0]
        address = VD[1]
        if PK == False:
            return 
        TX = {
            "nonce": w3.eth.get_transaction_count(w3.to_checksum_address(address)),
            "to": w3.to_checksum_address(to),
            "value": w3.to_wei(value, "ether"),
            "gasPrice": 10*10**9,
            "gas": 21000,
            "data": b"",
            "chainId": 17000
        }
        print(f"TX: {TX}")
        signed = w3.eth.account.sign_transaction(TX, PK)
        print(f"Signed Transaction: {signed}")
        w3.eth.send_raw_transaction(signed.rawTransaction)
        print(f"Transaction sent successfully.")

def help():
    print("init: Initialize an ethereum node.")
    print("\nview_address: Returns the address of the ethereum account. \n 1st param: Private Key file number to query")
    print("\nget_balance: (init first) Returns the balance of the ethereum account \n 1st param: Private Key file number to query")
    print("\nview_private_key (Make sure no one is looking): Returns Private Key of the ethereum account. \n 1st param: Private Key file number to query")
    print("\nsend_simple_transaction (init first): Send a simple Ethereum transaction. \n 1st param: Private Key file number to use \n 2nd param: Reciever of the transaction \n 3rd param: Value of the transaction")

action = {"view_address": (view_address, 1), "help": (help, 0), "init": (init, 0), "view_private_key": (view_private_key, 1), "get_balance": (view_balance, 1), "send_simple_transaction": (send_simple_transaction, 3)}

try:
    (sys.argv[1])
except IndexError:
    print("No command listed. Use 'help' to learn how to use this app.")
else:
    if sys.argv[1] in commands:
        if len(sys.argv)-2 == action[sys.argv[1]][1]:
            action[sys.argv[1]][0](*sys.argv[2:])
        else:
            print("Invalid amount of arguments. Use 'help' to learn how to use this app.")
    else:
        print("Invalid command.  Use 'help' to learn how to use this app.")