const Splitter = artifacts.require('./Splitter_Project/build/contracts/Splitter.json');
const assert = require('assert');
const expectedExeption = require("../utils/expectedExeption.js");

contract('Splitter', (accounts) => {
    beforeEach(async () => {
        contractInstance = await Splitter.deployed()
    })
    let Alice; 
    let Bob; 
    let Carol; 
    let amount; 

    it('should not send to only Bob', async() => {
        return expectedExeption(
            () => Splitter.sendSplit(bob, 0, { from: Alice, value:100, gas : 500000}),
            () => Splitter.sendSplit(bob,"0x0000000000000000000000000000000000000000", { from: Alice, value: 100, gas :5000000}), 
            5000000 )
        //assert.equal(amount == 10, "The value was not split right");
       // assert.equal(balance["0xe4722888c1e573b02a05acef6b3c67037b613c68"] == 110 && balance["0xcf999b275a7d7fc19f032c968a7de4b909944fa5"] == 110);
       // await contractInstance.sendSplit("0xcf999b275a7d7fc19f032c968a7de4b909944fa5", "0x8ba1dea5c4bc65a375ef4ac0db997ad9986f15aa");
    });

    it('should not allow one msg.sender to withdraw twice', async() => {
        return Splitter.withdraw({ from: carol})
        .then(txObject => web3eth.getBalancePromise(splitter.address)) 
        .then(txObject => web3.eth.getBalance(splitter.address))
        .then(balance => assert.strictEqual(balance.toString(10), "1001"));
    })
});