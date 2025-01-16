import os, time
import pyautogui
from Crypto.Cipher import AES
from web3 import Web3
import shutil
import ecdsa
from ecdsa import SECP256k1
from os import urandom
from booleanInput import BooleanInput

difference = 0
start = 0 
array = []
PKs = input("How many Private Keys do you wish to generate? ")
print(f"Wiggle your mouse to generate {PKs} private keys")
time.sleep(1)
last_pos = pyautogui.position()
while difference < 100000:
    x, y = pyautogui.position()
    difference += abs(last_pos[0]-x)
    difference += abs(last_pos[0]-x)
    difference += abs(last_pos[1]-y)
    array.append(x)
    array.append(y)
    generated = difference/1000
    if generated > 100:
        generated = 100
    print(f"{generated}% Generated")
    last_pos = (x, y)

def key_gen(entropy, salt_length=16) -> tuple[bytes, str]:
        salt = urandom(salt_length)
        PK = bytes(Web3.keccak(entropy+salt))
        sk = ecdsa.SigningKey.from_string(PK, curve=SECP256k1)
        PubKeyHash = Web3.keccak(bytes(sk.get_verifying_key().to_string()))
        addressBytes = PubKeyHash[len(PubKeyHash)-20:]
        address = addressBytes.hex()
        return (PK, address)

def getPossibleDrives() -> dict:
    return {chr(drive):f"{chr(drive)}:" for drive in range(ord("D"), ord("Z")) if os.path.exists(f"{chr(drive)}:") and os.path.getsize(f"{chr(drive)}:") == 0 and len(os.listdir("D:")) == 1}

print("To which drive would you like to save the Private Key and the Address?")
print("(Only empty drives are included) This is to avoid data corruption.")

while True:
    for value in getPossibleDrives().values(): 
        print(value+"\n")
    try:
        a = input()
        selection = getPossibleDrives()[a]
    except KeyError:
        print(f"\n The selected drive, ({a}) is not accessible. If it exists, it is not empty. \n")
        print(f"To which drive would you like to save the {PKs} Private Keys?")
    else:
        if BooleanInput("Save Private Keys using AES256 encryption? (reccommended) (y/n) "):
            print("Please select a password. \n Do not lose it, as you won't be able to recover your funds. \n Make sure no one is watching. \n YOU WON'T BE ABLE TO CHANGE IT")
            password = input("Password: ")
            key = Web3.keccak(password.encode())
            
            for i in range(0, int(PKs)):
                IV = os.urandom(16)
                print(f"Saving Private Key {i}...")
                PK = key_gen("".join([str(i) for i in array]).encode(), 32)[0]
                cipher = AES.new(key, AES.MODE_CBC, IV)
                ciphertext = cipher.encrypt(PK)

                with open(f"{selection}/PK{i}.bin", "wb") as drive:
                    drive.write(ciphertext)
                
                with open(f"{selection}/IV{i}.bin", "wb") as drive:
                    drive.write(IV)

                with open(f"{selection}/PKH{i}.bin", "wb") as drive:
                    drive.write(Web3.keccak(PK))
            
            with open(f"{selection}/withenc.bin", "wb") as f:
                f.write((1).to_bytes())
        else:
            for i in range(0, int(PKs)):
                print(f"Saving Private Key {i}...")
                PK = key_gen("".join([str(i) for i in array]).encode(), 32)[0]
                print(PK.hex())
                with open(f"{selection}/PK{i}.bin", "wb") as drive:
                    drive.write(PK)

            with open(f"{selection}/withenc.bin", "wb") as f:
                f.write((0).to_bytes())
        
        print(f"Done saving {PKs} Private Keys to {selection}")
        print("Saving Python Interaction file...")
        shutil.copy("see_keys.py", selection)
        print("Saved Python Interaction file.")


