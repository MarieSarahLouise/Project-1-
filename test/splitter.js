const Splitter = artifacts.require('Splitter');
const assert = require('assert');
const truffleAssert = require('truffle-assertions');

contract('Splitter', (accounts) => {
   
    const [alice, bob, carol, notOwner] = accounts;
    let contractInstance;
     beforeEach("create new instance", async function() {
        contractInstance = await Splitter.new( { from: alice } );
    });  

    it('Split should emit the expected event', async function(){
        let amount = 1000000000;
        let split = await contractInstance.split( bob, carol, { from: alice, value: amount } );
        const log = split.logs[0];
        assert.strictEqual(log.event, 'LogAmountSent');
        assert.strictEqual(log.args.from, alice);
        assert.strictEqual(log.args.bob, bob);
        assert.strictEqual(log.args.carol, carol);
        assert.strictEqual(log.args.amount.toString(), amount.toString());
    });

    it('Carol and Bob should have the expected internal balances after split (uneven amounts).', async function() {
        await contractInstance.split(bob, carol, { from : alice , value: 7 } );
        const bobsBalanceAfter = await (contractInstance.balances(bob));
        const carolsBalanceAfter = await (contractInstance.balances(carol));
        assert.equal(carolsBalanceAfter,  3, 'carols balance is not right');
        assert.equal(bobsBalanceAfter,  3,'bobs balance is not right');
    });

    it('Carol and Bob should have the expected internal balances after split (even amounts).', async function() {
        const amount = 1000000000;
        await contractInstance.split(bob, carol, { from : alice , value: amount } );
        const bobsBalanceAfter = await (contractInstance.balances(bob));
        const carolsBalanceAfter = await (contractInstance.balances(carol));
        const halfAmount = 500000000;
        assert.strictEqual(carolsBalanceAfter.toString(),  halfAmount.toString(), 'carols balance is not right');
        assert.strictEqual(bobsBalanceAfter.toString(),  halfAmount.toString(),'bobs balance is not right');
    });

    it('Alices balance should be right', async function(){
        const amount = 1000000000;
        const balanceBefore = await web3.eth.getBalance(alice);
        const split = await contractInstance.split( bob, carol, { from : alice, value: amount });
        let gasUsed = await split.receipt.gasUsed;
        let tx = await web3.eth.getTransaction(split.logs[0].transactionHash);
        let gasCost = gasUsed * tx.gasPrice;
        const balanceAfter = await web3.eth.getBalance(alice);
        let expectedBalanceAfter = balanceBefore - amount - gasCost;
        assert.strictEqual(expectedBalanceAfter.toString(), balanceAfter.toString(), 'alices balance is not right');
    });
       
    it('Withdraw should emit the expected event.', async function(){
        let amount = 1000000000;
        await contractInstance.split( bob, carol, { from: alice, value: amount } );
        let withdraw = await contractInstance.withdraw({from: bob});
        const log = withdraw.logs[0];
        assert.strictEqual(withdraw.logs.length, 1);
        assert.strictEqual(log.event, 'LogAmountWithdrawn', 'The right event was not emitted.');
        assert.strictEqual(log.args.from, bob, 'Bobs adress is not right.');
        splitAmount = amount/2;
        assert.strictEqual(log.args.amount.toString(), splitAmount.toString(), 'The right amount was not emitted.');
    });

    it('Bobs Balance after withdraw should be right', async function(){
        const amount = 1000000000;
        const balanceBefore = await web3.eth.getBalance(bob);
        await contractInstance.split( bob, carol, { from: alice, value: amount } );
        const txObj = await contractInstance.withdraw( { from: bob } );
        const tx = await web3.eth.getTransaction(txObj.tx);
        const receipt = txObj.receipt;
        const balanceAfter = await web3.eth.getBalance(bob);
        const gasCost = (tx.gasPrice)*(receipt.gasUsed);
        let expectedBalanceAfter = balanceBefore -  gasCost + 500000000;
        assert.strictEqual(balanceAfter.toString(), expectedBalanceAfter.toString(), 'bobs balance is not right');
    });

    it('Carols and Bobs internal balances after withdrawing should be 0', async function(){
        const amount = 1000000000;
        await contractInstance.split(bob, carol, { from: alice, value: amount});
        await contractInstance.withdraw({ from: carol });
        const carolsBalanceAfter = await (contractInstance.balances(carol));
         
        await contractInstance.withdraw({ from: bob });
        const bobsBalanceAfter = await (contractInstance.balances(bob));
         
        const balanceAfter = 0;
        assert.strictEqual(bobsBalanceAfter.toString(), balanceAfter.toString(), 'bobs balance is not right.');
        assert.strictEqual(carolsBalanceAfter.toString(), balanceAfter.toString(), 'carols balance is not right.');
    });

    it('Should throw because the owner is not the msg.sender', async function() {
        await truffleAssert.reverts(
            contractInstance.pause( { from: notOwner } ),
            "Only the owner can call this function."
        );
    });

    it('isPaused should be false', async function() {
        assert.strictEqual(await contractInstance.isPaused(), false);
    });

    it('The contract should be paused when the pause() function is called', async function() {
        await contractInstance.pause( { from : alice } );
        assert.strictEqual(await contractInstance.isPaused(), true);
    });

    it('The contract should be killed if the kill() function is called', async function() {
        await contractInstance.pause( { from : alice } );
        await contractInstance.kill( { from : alice } );
        assert.strictEqual(await contractInstance.isKilled(), true);
    });
});