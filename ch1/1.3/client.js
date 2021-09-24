const EthCrypto = require('eth-crypto');

// The client that end-users will use to interact with our central payment processor
class Client {
  // Initializes a public/private key pair for the user
  constructor() {
    this.wallet = EthCrypto.createIdentity();
    // initialize the nonce
    this.nonce= 0;
  }

  // Creates a keccak256/SHA3 hash of some data
  toHash(data) {
    const dataStr = JSON.stringify(data);//data here can be a JS object as shown here, https://cryptoeconomics.study/docs/en/sync/1.2-code-challenge#state
    return EthCrypto.hash.keccak256(dataStr);
  }

  // Signs a hash of data with the client's private key
  sign(message) {
    /*prolly can't directly use EthCrypto.hash.keccak256(message) for messageHash bcz message being JS Object,
       we need to JSON.stringify ig & we have toHash() function made specifically so better call it.*/
    const messageHash = this.toHash(message); 
    const sk= this.wallet.privateKey; //sk: secret-key OR private-key
    const signedHash= EthCrypto.sign(sk, messageHash);
    return signedHash;
  }

  // Verifies that a messageHash is signed by a certain address
  verify(signature, messageHash, address){
    //address is the Eth address
    const signer= EthCrypto.recover(signature, messageHash); //recover the signer
    if(signer == address) return true;
    else return false;
  }

  // Buys tokens from Paypal
  buy(amount) {
    // Let the user know that they just exchanged off-network goods for network tokens
    console.log(`You bought $${amount} of tokens from our Central Payment Processor off-network`);
  }

  // Generates new transactions
  generateTx(to, amount, type) {
    // create an unsigned transaction
    const unsignedTx = {
      type,
      amount,
      from: this.wallet.address,
      to,
      // add wallet nonce to tx
      nonce: this.nonce,
    };
    // create a signature of the transaction
    const sig= this.sign(unsignedTx);
    const tx= { //tx: short for transaction :)
      contents: unsignedTx,
      sig: sig,
    };
    // increment the wallet's nonce parameter AFTER the tx object is created
    this.nonce += 1;
    // return a Javascript object with the unsigned transaction and transaction signature
    return tx;
  }
}

module.exports = Client;
