import os
import time
import sys
from Crypto.Cipher import AES
from web3 import Web3
from ecdsa import SECP256k1
import ecdsa

commands = ["view_details"]

def view_details(private_key_number: int):
    IV, PKH = ("","")
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
        if bool(f.read()):
            print("You used a password to encrypt your private keys. ")
            password = input("Password: ")
            decrypt = AES.new((Web3.keccak(password.encode())), AES.MODE_CBC, IV)
            PK = decrypt.decrypt(PK)
    
    if PKH == Web3.keccak(PK):
        sk = ecdsa.SigningKey.from_string(PK, curve=SECP256k1)
        PubKeyHash = Web3.keccak(bytes(sk.get_verifying_key().to_string()))
        addressBytes = PubKeyHash[len(PubKeyHash)-20:]
        address = addressBytes.hex()
        print(f"PRIVATE KEY (Share if you want your funds gone): {PK.hex()} \n ADDRESS (Share if you want $$$): {address}")
    else: 
        print("Invalid password. Try again.")
        print(f"Expected hash: {PKH}. Hashed result: {Web3.keccak(PK)}")

def help():
    print("HELPI DOODLE DEEE")

action = {"view_details": (view_details, 1), "help": (help, 0)}

if sys.argv[1] in commands:
    if len(sys.argv)-2 == action[sys.argv[1]][1]:
        action[sys.argv[1]][0](*sys.argv[2:])
    else:
        print("Invalid amount of arguments. Use 'help' to learn how to use this app.")
    
else:
    print("Invalid command.  Use 'help' to learn how to use this app.")