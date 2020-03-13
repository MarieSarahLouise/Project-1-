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
        const amount = 1000000000;
        const split = await contractInstance.split( bob, carol, { from: alice, value: amount } );
        const { logs } = split;
        assert.strictEqual(logs.length, 1);
        const events = split.logs[0];
        assert.strictEqual(events.event, 'LogAmountSent');
        assert.strictEqual(events.args.from, alice);
        assert.strictEqual(events.args.bob, bob);
        assert.strictEqual(events.args.carol, carol);
        assert.strictEqual(events.args.amount.toString(), amount.toString());
    });

    it('Carol and Bob should have the expected internal balances after split (uneven amounts).', async function() {
        await contractInstance.split(bob, carol, { from : alice , value: 7 } );
        const bobsBalanceAfter = await contractInstance.balances(bob);
        const carolsBalanceAfter = await contractInstance.balances(carol);
        const alicesBalanceAfter  = await contractInstance.balances(alice);

        assert.strictEqual(alicesBalanceAfter.toString(), "1", 'alices balance is not right.')
        assert.strictEqual(carolsBalanceAfter.toString(),  "3", 'carols balance is not right.');
        assert.strictEqual(bobsBalanceAfter.toString(),  "3",'bobs balance is not right.');
    });

    it('Carol and Bob should have the expected internal balances after split (even amounts).', async function() {
        const amount = 1000000000;
        await contractInstance.split(bob, carol, { from : alice , value: amount } );
        const bobsBalanceAfter = await (contractInstance.balances(bob));
        const carolsBalanceAfter = await (contractInstance.balances(carol));

        assert.strictEqual(carolsBalanceAfter.toString(),  "500000000", 'carols balance is not right.');
        assert.strictEqual(bobsBalanceAfter.toString(),  "500000000",'bobs balance is not right.');
    });
       
    it('Withdraw should emit the expected event.', async function(){
        const amount = 1000000000;
        await contractInstance.split( bob, carol, { from: alice, value: amount } );
        let withdraw = await contractInstance.withdraw({from: bob});
        const log = withdraw.logs[0];
        assert.strictEqual(withdraw.logs.length, 1);
        assert.strictEqual(log.event, 'LogAmountWithdrawn', 'The right event was not emitted.');
        assert.strictEqual(log.args.from, bob, 'Bobs adress is not right.');
        assert.strictEqual(log.args.amount.toString(), "500000000", 'The right amount was not emitted.');
    });

    it('Bobs balance should not be reset after each split and Carol should be able to send ether.', async function() {
        const amount = 1000000000;
        await contractInstance.split(alice, bob, { from : carol , value: amount });
        await contractInstance.split(carol, bob, { from: alice, value : amount});
        const bobsBalanceAfter = await (contractInstance.balances(bob));

        assert.strictEqual(bobsBalanceAfter.toString(),  "1000000000",'bobs balance is not right.');
    });

    it('Bobs Balance after withdraw should be right.', async function(){
        const amount = 1000000000;
        const balanceBefore = await web3.eth.getBalance(bob);
        await contractInstance.split( bob, carol, { from: alice, value: amount } );
        const txObj = await contractInstance.withdraw( { from: bob } );
        const tx = await web3.eth.getTransaction(txObj.tx);
        const receipt = txObj.receipt;
        const balanceAfter = await web3.eth.getBalance(bob);
        const gasCost = (tx.gasPrice)*(receipt.gasUsed);
        const expectedBalanceAfter = balanceBefore -  gasCost + 500000000;

        assert.strictEqual(balanceAfter.toString(), expectedBalanceAfter.toString(), 'bobs balance is not right.');
    });

    it('Carols and Bobs internal balances after withdrawing should be 0.', async function(){
        const amount = 1000000000;
        await contractInstance.split(bob, carol, { from: alice, value: amount});
        await contractInstance.withdraw({ from: carol });
        const carolsBalanceAfter = await (contractInstance.balances(carol));
        
        await contractInstance.withdraw({ from: bob });
        const bobsBalanceAfter = await (contractInstance.balances(bob));
         
        assert.strictEqual(bobsBalanceAfter.toString(), "0", 'bobs balance is not right.');
        assert.strictEqual(carolsBalanceAfter.toString(), "0", 'carols balance is not right.');
    });

    it('Should not allow to pause, because the owner is not the msg.sender.', async function() {
        await truffleAssert.reverts(
            contractInstance.pause( { from: notOwner } ),
            "Only the owner can call this function."
        );
    });

    it('the Splitter should start un-paused.', async function() {
        assert.strictEqual(await contractInstance.isPaused(), false);
    });

    it('The contract should be paused when the pause() function is called.', async function() {
        await contractInstance.pause({ from : alice });
        assert.strictEqual(await contractInstance.isPaused(), true);
    });

    it('The contract should be killed if the kill() function is called.', async function() {
        await contractInstance.pause({ from : alice });
        await contractInstance.kill({ from : alice });
        assert.strictEqual(await contractInstance.isKilled(), true);
    });
});