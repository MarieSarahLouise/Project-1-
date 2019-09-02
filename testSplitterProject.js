const Splitter = artifacts.require('./Spliter_Project/contracts/splitter_contract.sol');
const assert = require('assert');
let contractInstance;

contractInstance('Splitter', (accounts) => {
    beforeEach(async () => {
        contractInstance = await Splitter.deployed()
    })

    it('should send 10 ether to bob and carol', async() => {
        msg.value = 20; 
        assert.equal(amount == 10, "The value was not split right");
        assert.equal(balance["0xe4722888c1e573b02a05acef6b3c67037b613c68"] == 110 && balance["0xcf999b275a7d7fc19f032c968a7de4b909944fa5"] == 110);
        await contractInstance.sendSplit("0xcf999b275a7d7fc19f032c968a7de4b909944fa5", "0x8ba1dea5c4bc65a375ef4ac0db997ad9986f15aa");
    })
})