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
        const toWithdraw = web3.utils.toWei(web3.utils.toBN(1, 'ether'));
        console.log('toWithdraw'+toWithdraw);
        const balanceBefore = await web3.eth.getBalance(bob);
        

        await contractInstance.split( bob, carol, { from: alice, value: toWithdraw } )

        const balanceAfter = await web3.eth.getBalance(bob);
        const txObj = await contractInstance.withdraw( { from: bob } );
        //console.log(JSON.stringify(txObj, null, 4));
        console.log('balanceBefore'+balanceBefore);
        
        console.log('balaceAfter'+balanceAfter);
        const tx = await web3.eth.getTransaction(txObj);
        const receipt = await web3.eth.getTransactionReceipt(tx);
        const gasCost = tx.gasPrice.mul(receipt.gasUsed);  
        console.log('gasCost'+gasCost);
        console.log('wtf');

        assert.strictEqual(balanceAfter, (balanceBefore-gasCost+toWithdraw));

        });
        
    

    it('The internal balances of Carol and Bob after executing split() should be equal to half of the amount, alices internal balance should be equal to her original balance minus the split amount.', async() => {
        const amount = web3.utils.toWei(web3.utils.toBN(1, 'ether'));
        console.log('amount'+amount);

        const alicesBalanceBefore = await (contractInstance.balances[0]);
        console.log(alicesBalanceBefore);
        const bobsBalanceBefore = await (contractInstance.balances[1]);
        const carolsBalanceBefore = await (contractInstance.balances[2]);
       
        await contractInstance.split(bob, carol, { from : alice , value: amount} );

        const alicesBalanceAfter = await (contractInstance.balances[0]);
        console.log(alicesBalanceAfter);
        const carolsBalanceAfter = await (contractInstance.balances[1]);
        const bobsBalanceAfter = await (contractInstance.balances[2]);
        
        
        assert.strictEqual(alicesBalanceAfter, (alicesBalanceBefore- amount));
        assert.strictEqual(carolsBalanceAfter, (carolsBalanceBefore + (amount/2)));
        assert.strictEqual(bobsBalanceAfter, (bobsBalanceBefore + (amount/2)));

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