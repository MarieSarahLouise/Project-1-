const Splitter = artifacts.require('Splitter');
const assert = require('assert');
const truffleAssert = require('truffle-assertions');

contract('Splitter', (accounts) => {
   
    const [alice, bob, carol, notOwner] = accounts;
    let contractInstance;
     beforeEach("create new instance", async () => {
        contractInstance = await Splitter.new( { from: alice } );
    });  

    it('bobs balance should be equal to his original balance, minus the gas price, plus the withdrawn amount', async() => {
        const toWithdraw = 1000000000000000000;
        const balanceBefore = await web3.eth.getBalance(bob);
        await contractInstance.split( bob, carol, { from: alice, value: toWithdraw } );
        const txObj = await contractInstance.withdraw( { from: bob } );
        const tx = await web3.eth.getTransaction(txObj.tx);
        const receipt = txObj.receipt;
        const balanceAfter = await web3.eth.getBalance(bob);
        const gasCost = (tx.gasPrice)*(receipt.gasUsed); 
        assert.equal(balanceAfter, balanceBefore -  gasCost + toWithdraw/2, 'bobs balance is not right');
        });
        
    it('The internal balances of Carol and Bob after executing split() should be equal to half of the amount.', async() => {
        const amount = 1000000000000000000;
        const bobsBalanceBefore = await contractInstance.isBalance(bob);
        const carolsBalanceBefore = await contractInstance.isBalance(carol);
        await contractInstance.split(bob, carol, { from : alice , value: amount } );
        const bobsBalanceAfter = await (contractInstance.balances(bob));
        const carolsBalanceAfter = await contractInstance.isBalance(carol);
        
        assert.equal(carolsBalanceAfter, +carolsBalanceBefore + amount/2, 'carols balance is not right');
        assert.equal(bobsBalanceAfter, +bobsBalanceBefore + amount/2,'bobs balance is not right');

    });

    it('should throw because the owner is not the msg.sender', async() =>{
        await truffleAssert.reverts(
            contractInstance.pause( { from: notOwner } ),
            "Only the owner can call this function."
        );
    });

    it('The contract should be paused when the pause() function is called', async() => {
        contractInstance.pause( { from : alice } );
        assert.strictEqual(await contractInstance.isPaused(), true);
    });

    it('The contract should be killed if the kill() function is called', async() => {
        await contractInstance.pause( { from : alice } );
        await contractInstance.kill( { from : alice } );
        assert.strictEqual(await contractInstance.isKilled(), true);
    });
});