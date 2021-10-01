/* This file is just for testing,  since my forEach() implementation of looping through pendingTx[] & all 
    didn't pass the tests..I don't know about the logic which is causing it also 
    I doubt the tests provided :)... So, really don't know. 
    
    I'M LEAVING 1.3 FOR NOW... COULDN'T GET THE paypal.js to work*/
class A{
    constructor(){
        this.pendingTx= ["a", "b", "c"];
    }

    func1(){
        this.pendingTx.forEach((value, index) => {
            console.log(value, index);
            console.log(typeof value, typeof index);
        })
    }
    //OUTPUT of above func1() ::
    /*
    a 0
    string number
    b 1
    string number
    c 2
    string number
    */

    func2(){
        for (const tx in this.pendingTx){
            const value= this.pendingTx[tx];
            console.log(value, tx);
            console.log(typeof value, typeof tx);
        }
    }
    //OUTPUT of above func2()
    /*
    a 0
    string string
    b 1
    string string
    c 2
    string string
    */    

}
const obj= new A();
obj.func1();
obj.func2();

/*
    Using forEach() gives 'index', which is a 'number' as shown in output, but when using for loop as-
    <tx in this.pendingTx> which seems like looping with an index number since- we get a value with
 */
