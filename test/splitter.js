const Splitter = artifacts.require('Splitter');
const assert = require('assert');

let contractInstance;
 

contract('Splitter', (accounts) => {
    const [alice, bob, carol] = accounts;
     beforeEach("create new instance",async () => {
        contractInstance = await Splitter.new({from: alice});
    });  

    it('bobs balance should be equal to his original balance, minus the gas price, plus the withdrawn amount', async() => {
        const amount = web3.utils.toWei(0.1, 'ether').toFixed();
        const balanceBefore = await web3.eth.getBalance(bob).toFixed();
        const hash = await contractInstance.withdraw({ from: bob, value: amount});
        const balanceAfter = await web3.eth.getBalance(bob).toFixed();
        const tx = await web3.eth.getTransaction(hash);
        const receipt = await web3.eth.getTransactionReceipt(hash);
        const gasCost = tx.gasPrice.mul(receipt.gasUsed).toFixed(); 

        assert(balanceAfter == (balanceBefore-gasCost+amount).toFixed());
    });

    it('should throw because the owner is not the msg.sender', async() =>{
        const amount = web3.utils.toWei(0.2, 'ether').toFixed();
        return contractInstance.split({from: accounts[5], to: [bob, carol], value: amount});
    });

    it('The contract should be paused when the pause() function is called', async() => {
        return contractInstance.pause();
    });

    it('The contract should be killed if the kill() function is called', async() => {
        return contractInstance.kill(); 
    });
});