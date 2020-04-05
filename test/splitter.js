const Splitter = artifacts.require("Splitter");
const assert = require("assert");
const truffleAssert = require("truffle-assertions");
const { toWei, toBN } = web3.utils;

contract("Splitter", (accounts) => {
   
    const [alice, bob, carol, notOwner] = accounts;
    let contractInstance;
     beforeEach("create new instance", async function() {
        contractInstance = await Splitter.new( { from: alice } );
    });  

    it("Split should emit the expected event", async function(){
        const amount = toWei(toBN("1"), "Gwei");
        const splitObj = await contractInstance.split(bob, carol, { from: alice, value: amount });
        const { logs } = splitObj;
        assert.strictEqual(logs.length, 1);
        const splitEvent = splitObj.logs[0]; 
        assert.strictEqual(splitEvent.event, "LogAmountSent");
        assert.strictEqual(splitEvent.args.from, alice);
        assert.strictEqual(splitEvent.args.bob, bob);
        assert.strictEqual(splitEvent.args.carol, carol);
        assert.strictEqual(splitEvent.args.amount.toString(), amount.toString());
    });

    it("Carol and Bob should have the expected internal balances after split (uneven amounts).", async function() {
        await contractInstance.split(bob, carol, { from : alice , value: 7 });
        const bobsBalanceAfter = await contractInstance.getBalance(bob);
        const carolsBalanceAfter = await contractInstance.getBalance(carol);
        const alicesBalanceAfter  = await contractInstance.getBalance(alice);

        assert.strictEqual(alicesBalanceAfter.toString(), "1", "alices balance is not right.");
        assert.strictEqual(carolsBalanceAfter.toString(), "3", "carols balance is not right.");
        assert.strictEqual(bobsBalanceAfter.toString(), "3", "bobs balance is not right.");
    });

    it("Carol and Bob should have the expected internal balances after split (even amounts).", async function() {
        const amount = toWei(toBN("1"), "Gwei");
        await contractInstance.split(bob, carol, { from : alice , value: amount });
        const bobsBalanceAfter = await contractInstance.getBalance(bob);
        const carolsBalanceAfter = await contractInstance.getBalance(carol);

        assert.strictEqual(carolsBalanceAfter.toString(),  toWei("0.5", "Gwei"), "carols balance is not right.");
        assert.strictEqual(bobsBalanceAfter.toString(),  toWei("0.5", "Gwei"), "bobs balance is not right.");
    });
       
    it("Withdraw should emit the expected event.", async function(){
        const amountToSplit = toWei(toBN("1"), "Gwei");
        await contractInstance.split( bob, carol, { from: alice, value: amountToSplit });
        const withdrawObj = await contractInstance.withdraw({ from: bob });
        assert.strictEqual(withdrawObj.logs.length, 1);
        const withdrawEvents = withdrawObj.logs[0];
        assert.strictEqual(withdrawEvents.event, "LogAmountWithdrawn", "The right event was not emitted.");
        assert.strictEqual(withdrawEvents.args.from, bob, "Bobs adress is not right.");
        assert.strictEqual(withdrawEvents.args.amount.toString(), toWei("0.5", "Gwei"), "The right amount was not emitted.");
    });

    it("Bobs balance should not be reset after each split and Carol should be able to send ether.", async function() {
        const amount1 = toWei("1", "Gwei");
        const amount2 = toWei("0.5", "Gwei");
        await contractInstance.split(alice, bob, { from: carol , value: amount1 });
        await contractInstance.split(carol, bob, { from: alice, value : amount2 });
        const bobsBalanceAfter = await contractInstance.getBalance(bob);

        assert.strictEqual(bobsBalanceAfter.toString(), toWei("0.75", "Gwei"), "bobs balance is not right.");
    });

    it("Bobs Balance after withdraw should be right.", async function(){
        const amount = toWei(toBN("1"), "Gwei");
        const balanceBefore = await web3.eth.getBalance(bob);
        await contractInstance.split( bob, carol, { from: alice, value: amount });
        const txObj = await contractInstance.withdraw({ from: bob });
        const tx = await web3.eth.getTransaction(txObj.tx);
        const receipt = txObj.receipt;
        const balanceAfter = await web3.eth.getBalance(bob);
        const gasCost = toBN((tx.gasPrice)).mul(toBN((receipt.gasUsed)));
        const expectedBalanceAfter = toBN(balanceBefore).sub(toBN(gasCost)).add(toBN(toWei("0.5", "Gwei")));

        assert.strictEqual(balanceAfter.toString(), expectedBalanceAfter.toString(), "bobs balance is not right.");
    });

    it("Carols and Bobs internal balances after withdrawing should be 0.", async function(){
        const amount = toWei(toBN("1"), "Gwei");
        await contractInstance.split(bob, carol, { from: alice, value: amount });
        await contractInstance.withdraw({ from: carol });
        const carolsBalanceAfter = await contractInstance.getBalance(carol);
        
        await contractInstance.withdraw({ from: bob });
        const bobsBalanceAfter = await contractInstance.getBalance(bob);
         
        assert.strictEqual(bobsBalanceAfter.toString(), "0", "bobs balance is not right.");
        assert.strictEqual(carolsBalanceAfter.toString(), "0", "carols balance is not right.");
    });

    it("Should not allow to pause, because the owner is not the msg.sender.", async function() {
        await truffleAssert.reverts(
            contractInstance.pause({ from: notOwner }),
            "Only the owner can call this function."
        );
    });

    it("the Splitter should start un-paused.", async function() {
        assert.strictEqual(await contractInstance.isPaused(), false);
    });

    it("The contract should be paused when the pause() function is called.", async function() {
        await contractInstance.pause({ from: alice });
        assert.strictEqual(await contractInstance.isPaused(), true);
    });

    it("The contract should be killed if the kill() function is called.", async function() {
        await contractInstance.pause({ from: alice });
        await contractInstance.kill({ from: alice });
        assert.strictEqual(await contractInstance.isKilled(), true); //assert.isTrue() does not work => 'TypeError: assert.isTrue is not a function'
    });
});