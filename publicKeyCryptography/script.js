// Bits and Bytes in JS


// Bit
const x = 0;
console.log(x);



// Byte
const y = 202
console.log(y);



// Array of bytes
const bytes = [202, 244, 1, 23]
console.log(bytes);



// UInt8Array in JS
let byte = new Uint8Array([0, 255, 127, 128]);
console.log(byte)

let uint8Arr = new Uint8Array([0, 255, 127, 128]);
uint8Arr[1] = 300;



// Bytes to Ascii
function bytesToAscii(byteArray) {
  return byteArray.map(byte => String.fromCharCode(byte)).join('');
}

const bytess = [72, 101, 108, 108, 111]; 
const asciiString = bytesToAscii(bytess);
console.log(asciiString);



// Ascii to bytes
function asciiToBytes(asciiString) {
  const byteArray = [];
  for (let i = 0; i < asciiString.length; i++) {
    byteArray.push(asciiString.charCodeAt(i));
  }
  return byteArray;
}

const ascii = "Hello";
const byteArray = asciiToBytes(ascii);
console.log(byteArray); 



// UInt8Array to ascii
function bytesToAscii(byteArray) {
  return new TextDecoder().decode(byteArray);
}

// Example usage:
const bytes = new Uint8Array([72, 101, 108, 108, 111]); 
const asciiString = bytesToAscii(bytes);
console.log(asciiString);



// Ascii to UInt8Array
function asciiToBytes(asciiString) {
  return new Uint8Array([...asciiString].map(char => char.charCodeAt(0)));
}

const ascii = "Hello";
const byteArray = asciiToBytes(ascii);
console.log(byteArray); 



// Array to hex
function arrayToHex(byteArray) {
  let hexString = '';
  for (let i = 0; i < byteArray.length; i++) {
    hexString += byteArray[i].toString(16).padStart(2, '0');
  }
  return hexString;
}

const byteArray1 = new Uint8Array([72, 101, 108, 108, 111]); 
const hexString = arrayToHex(byteArray1);
console.log(hexString); 



// Hex to array
function hexToArray(hexString) {
  const byteArray = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return byteArray;
}

const hex = "48656c6c6f";
const byteArrayFromHex = hexToArray(hex);
console.log(byteArrayFromHex); 



// Encode
const bs58 = require('bs58');

function uint8ArrayToBase58(uint8Array) {
  return bs58.encode(uint8Array);
}

const byteArray = new Uint8Array([72, 101, 108, 108, 111]); 
const base58String = uint8ArrayToBase58(byteArray);
console.log(base58String); 



// Decode
const bs58 = require('bs58');

function base58ToUint8Array(base58String) {
  return bs58.decode(base58String);
}

const base58 = base58String; 
const byteArrayFromBase58 = base58ToUint8Array(base58);
console.log(byteArrayFromBase58); 



// Symetric encryption
const crypto = require('crypto');

const key = crypto.randomBytes(32); 
const iv = crypto.randomBytes(16); 

function encrypt(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const textToEncrypt = 'Hello, World!';
const encryptedText = encrypt(textToEncrypt);
const decryptedText = decrypt(encryptedText);

console.log('Original Text:', textToEncrypt);
console.log('Encrypted Text:', encryptedText);
console.log('Decrypted Text:', decryptedText);



//! Public-Private Keypair

import * as ed from "@noble/ed25519";

async function main() {
  const privKey = ed.utils.randomPrivateKey();
  const message = new TextEncoder().encode("hello world");

  const pubKey = await ed.getPublicKey(privKey);
  const signature = await ed.sign(message, privKey);
  const isValid = await ed.verify(signature, message, pubKey);

  console.log("Private:", privKey);
  console.log("Public:", pubKey);
  console.log("Signature:", signature);
  console.log("Valid:", isValid);
}

main();



import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

const keypair = Keypair.generate();

const publicKey = keypair.publicKey.toString();
const secretKey = keypair.secretKey;

console.log("Public Key:", publicKey);
console.log("Private Key (Secret Key):", secretKey);

const message = new TextEncoder().encode("hello world");

const signature = nacl.sign.detached(message, secretKey);
const result = nacl.sign.detached.verify(
  message,
  signature,
  keypair.publicKey.toBytes(),
);

console.log(result);



//? Mnemonics
import { generateMnemonic } from 'bip39';

const mnemonic = generateMnemonic();
console.log('Generated Mnemonic:', mnemonic);



//* Seed phrase
import { generateMnemonic, mnemonicToSeedSync } from "bip39";

const mnemonic = generateMnemonic();
console.log("Generated Mnemonic:", mnemonic);
const seed = mnemonicToSeedSync(mnemonic);



//! Derivation paths
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";

const mnemonic = generateMnemonic();
const seed = mnemonicToSeedSync(mnemonic);
for (let i = 0; i < 4; i++) {
  const path = `m/44'/501'/${i}'/0'`; 
  const derivedSeed = derivePath(path, seed.toString("hex")).key;
  const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
  console.log(Keypair.fromSecretKey(secret).publicKey.toBase58());
}






