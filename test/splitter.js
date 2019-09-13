const Splitter = artifacts.require('Splitter');
const assert = require('assert');

let contractInstance;

contract('Splitter', (accounts) => {
     beforeEach("create new instance",async () => {
        return Splitter.new({ from: alice})
        .then(function(instance){
           contractInstance = instance;
        })
        

        })
    let alice = accounts[0]; 
    let bob = accounts[1];  
    let carol = accounts[2];  

    it('bobs balance should be equal to his original balance, minus the gas price, plus the withdrawn amount', async() => {
        const amount = web3.utils.toWei(10, 'ether').toString();
        const balanceBefore = await web3.eth.getBalance(bob).toString();
        const hash = await contractInstance.withdraw({ from: bob, value: amount});
        const balanceAfter = await web3.eth.getBalance(bob).toString();
        const tx = await web3.eth.getTransaction(hash);
        const receipt = await web3.eth.getTransactionReceipt(hash);
        const gasCost = tx.gasPrice.mul(receipt.gasUsed).toString(); 

        assert(balanceAfter == (balanceBefore-gasCost+amount).toString());
    });

    it('should throw because the owner is not the msg.sender', async() =>{
        owner = accounts[0];
        web3.utils.toWei(10, 'ether').toString() = msg.value;
        accounts[4] = msg.sender;
        return contractInstance.split(bob, carol);
    });

    it('The contract should be paused when the pause() function is called', async() => {
        contractInstance.pause();
        return LogPause;
    });

    it('The contract should be killed if the kill() function is called'), async() => {
        contractInstance.kill();
        return LogKill; 
    }


});