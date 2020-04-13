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

    it("The contract should not be killed if it is not paused.", async function() {
        await truffleAssert.reverts(
            contractInstance.kill({ from: alice }), 
            "The contract is running.")
    });

    it("The contract should be killed if it was paused and the kill() function is called.", async function() {
        await contractInstance.pause({ from: alice });
        await contractInstance.kill({ from: alice });
        assert.strictEqual(await contractInstance.isKilled(), true); //assert.isTrue() does not work => 'TypeError: assert.isTrue is not a function'
    });

    it("Only the Owner can kill the contract.", async function() {
        await contractInstance.pause({ from: alice });
        await truffleAssert.reverts(
            contractInstance.kill({ from: notOwner }), 
            "Only the owner can call this function.")
    });

    it("The contract should not be killed twice.", async function() {
        await contractInstance.pause({ from: alice });
        await contractInstance.kill({ from: alice });
        await truffleAssert.reverts(
            contractInstance.kill({ from: alice }), 
            "The contract has already been killed.")
    });

    it("The funds should only be returned if the contract is killed.", async function() {
        await truffleAssert.reverts(
            contractInstance.returnTheFunds({ from: alice }), 
            "The contract is still running.")
    });

    it("Only the owner should return the funds.", async function() {
        await contractInstance.pause({ from: alice });
        await contractInstance.kill({ from: alice });
        await truffleAssert.reverts(
            contractInstance.returnTheFunds({ from: notOwner }), 
            "Only the owner can call this function.")
    });

});