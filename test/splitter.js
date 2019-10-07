const Splitter = artifacts.require('Splitter');
const assert = require('assert');
const truffleAssert = require('truffle-assertions');

contract('Splitter', (accounts) => {
    const [alice, bob, carol, notOwner] = accounts;
     beforeEach("create new instance", async () => {
        contractInstance = await Splitter.new( { from: alice } );
    });  

    it('bobs balance should be equal to his original balance, minus the gas price, plus the withdrawn amount', async() => {
        const amount = web3.utils.toWei(0.1, 'ether').toBigNumber();
        const balanceBefore = (await web3.eth.getBalance(bob)).toBigNumber();
        const hash = await contractInstance.withdraw({ from: bob, value: amount });
        const balanceAfter = (await web3.eth.getBalance(bob)).toBigNumber();
        const tx = await web3.eth.getTransaction(hash);
        const receipt = await web3.eth.getTransactionReceipt(hash);
        const gasCost = tx.gasPrice.mul(receipt.gasUsed).toBigNumber(); 

        assert(balanceAfter == (balanceBefore-gasCost+amount).toBigNumber());
    });

    it('should throw because the owner is not the msg.sender', async() =>{
        await truffleAssert.reverts(
            contractInstance.pause({ from: notOwner }),
            "Only the Owner can pause this contract."
        );
        
    });

    it('The contract should be paused when the pause() function is called', async() => {
        return contractInstance.pause( {from : alice} );
    });

    it('The contract should be killed if the kill() function is called', async() => {
        return contractInstance.kill(); 
    });
});                                        