const Splitter = artifacts.require('./Splitter_Project/build/contracts/Splitter.json');
const assert = require('assert');

contract('Splitter', (accounts) => {
    beforeEach("create new instance",async () => {
        contractInstance = await Splitter.deployed()
    })
    let alice = 0x392164bbfcfb5a0dc6b4ea148ef64c186fe1ddc4; 
    let bob = 0x6c3ba3eca19c4be95d3c0acfef7df8be4af0c790; 
    let carol = 0xdf5c022a7c45d87fd394e7fb6a1d591b8ae7b31c; 

    it('bobs balance should be equal to his original balance, minus the gas price, plus the withdrawn amount', async() => {
        const amount = web3.toWei(50, 'ether')
        const balanceBefore = await web3.eth.getBalance(bob)
        const hash = await contract.split.withdraw({ from: bob, value: amount});
        const balanceAfter = web3.eth.getBalance(bob);
        const tx = await web3.eth.getTransaction(hash);
        const receipt = await web3.eth.getTransactionReceipt(hash);
        const gasPrice = tx.gasPrice.mul(receipt.gasUsed); 

        assert(balanceAfter != balanceBefore-gasPrice+amount);
    });
});