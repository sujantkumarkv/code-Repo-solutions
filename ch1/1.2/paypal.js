const EthCrypto = require('eth-crypto');
const Client = require('./client.js');

// Our naive implementation of a centralized payment processor
class Paypal extends Client {
  constructor() {
    super();//Paypal class also has access to Client's <this.wallet>
    // the state of the network (accounts and balances)
    this.state = {
      [this.wallet.address]: {
        balance: 1000000,
      },
    };
    // the history of transactions
    this.txHistory = [];
  }

  // Checks that the sender of a transaction is the same as the signer
  checkTxSignature(tx) {
    // get the signature from the transaction
    const txSig= tx.sig;
    const message= tx.contents; //contains unsignedTx
    const messageHash= this.toHash(message);
    const address= tx.contents.from;
    // if the signature is invalid print an error to the console and return false
    if (this.verify(txSig, messageHash, address) == false){
      console.log("Error !! Invalid Signature.");
      return false;
    }
    // return true if the transaction is valid
    else return true;
  }

  // Checks if the user's address is already in the state, and if not, adds the user's address to the state
  checkUserAddress(tx) {
    // check if the sender is in the state
    if (tx.contents.from in this.state == false){
      // if the sender is not in the state, create an account for them
      this.wallet = EthCrypto.createIdentity();
    }
    // check if the receiver is in the state
    if (tx.contents.to in this.state == false){
      // if the receiver is not in the state, create an account for them
      this.wallet= EthCrypto.createIdentity();
    }
    // once the checks on both accounts pass (they're both in the state), return true
    //WHETHER WE HAVE IT IN STATE/NOT;WE CREATE AN ACCOUNT,SO ULTIMATELY WE HAVE IT SO FINALLY GOTTA return true only.
    return true; 
  }

  // Checks the transaction type and ensures that the transaction is valid based on that type
  checkTxType(tx) {
    // if the transaction type is 'mint'
    if (tx.contents.type === 'mint'){ // triple equality: 'strict equality' even the datatype is checked.
      // check that the sender is PayPal
      if (tx.contents.from != this.wallet.address){
        // if the check fails, print an error to the concole stating why and return false so that the transaction is not processed
        console.log("Non-paypal clients can't mint.");
        return false;
      }
      // if the check passes, return true
      return true;
    }
    const sender= tx.contents.from;
    // if the transaction type is 'check'
    if (tx.contents.type === 'check'){
      // print the balance of the sender to the console
      balance= this.state[sender].balance;
      console.log(`Your available balance is :: ${balance}`);
      // return false so that the stateTransitionFunction does not process the tx
      return false;  
    }

    // if the transaction type is 'send'
    if (tx.contents.type === 'send'){
      // check that the transaction amount is positive and the sender has an account balance greater than or equal to the transaction amount
      // if a check fails, print an error to the console stating why and return false

      if ((this.state[sender].balance - tx.contents.amount) < 0){
        console.log("Error! Transaction amount crossed available balance.");
        return false;
      }
      // if the check passes, return true
      return true;
      }
    }

  // Checks if a transaction is valid, adds it to the transaction history, and updates the state of accounts and balances
  checkTx(tx) {
    const flag= 0;
    // check that the transaction signature is valid
    if (this.checkTxSignature(tx)){
      // check that the transaction sender and receiver are in the state
      if (this.checkUserAddress(tx)){
        // check that the transaction type is valid        
        if(this.checkTxType(tx)){
          // flag=1 only if all checks pass :)
          flag= 1;
        }
      }
    }
    // if all checks pass return true
    if (flag==1) return true;
    // if any checks fail return false
    else return false;
  }

  // Updates account balances according to a transaction and adds the transaction to the history
  applyTx(tx) {
    const sender= tx.contents.from;
    const receiver= tx.contents.to;
    // decrease the balance of the transaction sender/signer
    this.state[sender].balance -= tx.contents.amount;
    // increase the balance of the transaction receiver
    this.state[receiver] += tx.contents.amount
    // add the transaction to the transaction history
    //const newTx= this.generateTx(receiver, tx.contents.amount, 'send') //WRONG LOGIC
    this.txHistory.push(tx)
    // return true once the transaction is processed
    return true;
  }

  // Process a transaction
  processTx(tx) {
    // check the transaction is valid
    if (this.checkTx(tx)){
      // apply the transaction to Paypal's state
      this.applyTx(tx);
    }
  }
}

module.exports = Paypal;
