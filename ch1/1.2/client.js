const EthCrypto = require('eth-crypto');

// The client that end-users will use to interact with our central payment processor
class Client {
  // Initializes a public/private key pair for the user
  constructor() {
    this.wallet = EthCrypto.createIdentity();
  }

  // Creates a keccak256/SHA3 hash of some data
  toHash(data) {
    const dataStr = JSON.stringify(data);//data here can be a JS object as shown here, https://cryptoeconomics.study/docs/en/sync/1.2-code-challenge#state
    return EthCrypto.hash.keccak256(dataStr);
  }

  // Signs a hash of data with the client's private key
  sign(message) {
    /* prolly can't directly use EthCrypto.hash.keccak256(message) for messageHash bcz message being JS Object,
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
    // TODO:
    // create an unsigned transaction
    // create a signature of the transaction
    // return a Javascript object with the unsigned transaction and transaction signature
    const unsignedTx= {
      type,
      amount,
      from: this.wallet.address,
      to,
    };
    sig= this.sign(unsignedTx);
    const tx= { //tx: short for transaction :)
      contents: unsignedTx,
      sig: sig,
    };
    return tx;
  }

}
/*
const obj= new Client();
console.log(obj)

JUST CHECKING THE FORMAT of EthCrypto.createIdentity() object. Example below::
Client {
  wallet: {
    address: '0x90233Fa446221152223654C23338a28C80fB4AbE',
    privateKey: '0x1ab0cf72095454b1ca46ba8daa015817795c434704f49b9280039b818e30b88d',
    publicKey: '416acf4370e937e118c6d08893b3a8e8e93217140514b9dbfdbb36e5852cafe45dc6309390111e8a47715b40e3a2df30e8b77f1cd01f55feda50247646411d14'
  }
}
the pk & sk changes after re-running code. 
*
*/
module.exports = Client;
