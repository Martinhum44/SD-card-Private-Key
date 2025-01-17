import os
import time
import sys
from Crypto.Cipher import AES
from web3 import Web3
from ecdsa import SECP256k1
import ecdsa
import subprocess

commands = ["view_address", "help", "init", "get_balance", "view_private_key"]

def init():
    print("installing PyEthereum")
    subprocess

def view_details(private_key_number: int):
    IV, PKH = ("".encode(),"".encode())
    try:
        with open(f"IV{private_key_number}.bin", "rb") as f:
            IV = f.read()
        with open(f"PKH{private_key_number}.bin", "rb") as f:
            PKH = f.read()
    except FileNotFoundError:
        pass
    with open(f"PK{private_key_number}.bin", "rb") as f:
        PK = f.read()
        
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

def help():
    print("init: Initialize an ethereum node.")
    print("\nview_address: Returns the address of the ethereum account. \n 1st param: Private Key file number to query")
    print("\nget_balance: (init first) Returns the balance of the ethereum account \n 1st param: Private Key file number to query")
    print("\nview_private_key (Make sure no one is looking): Returns Private Key of the ethereum account. \n 1st param: Private Key file number to query")

action = {"view_address": (view_address, 1), "help": (help, 0), "init": (init, 0), "view_private_key": (view_private_key, 1)}

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