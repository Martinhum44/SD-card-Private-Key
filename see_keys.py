import os
import time
import sys
from Crypto.Cipher import AES
from web3 import Web3

commands = ["view_detials"]

def view_details(private_key_number: int):
    with open(f"IV{private_key_number}.bin", "rb") as f:
        IV = f.read()
    with open(f"PK{private_key_number}.bin", "rb") as f:
        PK = f.read()
    with open("withenc.bin", "rb") as f:
        if bool(f.read()):
            print("You used a password to encrypt your private keys. ")
            password = input("Password: ")
            decrypt = AES.new((Web3.keccak(password)), AES.MODE_CBC, IV)
            PK = decrypt.decrypt(PK)
    print(PK.hex())

def help():
    print("HELPI DOODLE DEEE")

action = {"view_details": (view_details, 1), "help": (help, 0)}

if sys.argv[1] in commands:
    if len(sys.argv-1) == action[sys.argv[1]][1]:
        action[sys.argv[1]][0](...[sys.argv])
    else:
        print("Invalid amount of arguments. Use 'help' to learn how to use this app.")
    
else:
    print("Invalid command.  Use 'help' to learn how to use this app.")