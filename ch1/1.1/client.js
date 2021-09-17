const EthCrypto = require('eth-crypto');
//import EthCrypto from "eth-crypto"

// The client that end-users will use to interact with our central payment processor
class Client {
  // The constructor will initialize a public/private key pair for the user
  // - the public key is like an username or address that people can send stuff to
  // - the private key is like a password or key that allows someone to access the stuff in the account and send transactions/messages from that account
  constructor() { //it's equivalent to python's __init__()
    // create a new Ethereum-identity with EthCrypto.createIdentity()
    // - should create a Javascript object with a privateKey, publicKey and address
    this.wallet = EthCrypto.createIdentity();
  }

  // Creates a keccak256/SHA3 hash of some data [KECCAK is used by ETHEREUM]
  hash(data) {
    return EthCrypto.hash.keccak256(data);
  }

  // Signs a hash of data with the client's private key
  sign(data) {
    const sk= this.wallet.privateKey; //private-key
    const dataHash= EthCrypto.hash.keccak256(data); // this.hash(data) WORKS TOO.
    const signedHash= EthCrypto.sign(sk, dataHash);
    return signedHash;
  }

  // Verifies that a messageHash is signed by a certain address
  verify(signature, messageHash, address){
    //address is the Eth address :: PK
    const signer= EthCrypto.recover(signature, messageHash); //recover the signer basically it's PK
    if(signer == address) return true;
    else return false;
  }
}

const obj= new Client()
console.log(obj.wallet) 
/*
To get the details after creating an user identity from createIdentity()
const obj= new Client()
console.log(obj.wallet) 

{
  address: '0xf851104eb7478bB44B2F23D1e3e6F5A45e6B174b',
  privateKey: '0xfef12c26b2d95bfbb0bb3b1a9490ce77971705e1b26316ba7e909bcaa5c9dd6a',
  publicKey: 'cde863c12dabc8bba7db3cbd4dd2e45c5cc1811f2b13e3001a7d511c49497dc94b875d86881632acbf7ec6752bc57e866e1857ce3c8d8c63dbab50ee2aa73aa4'
}
*/
module.exports = Client;
//export default class {Client};