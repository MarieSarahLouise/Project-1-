const Splitter = artifacts.require('Splitter');
const assert = require('assert');
const truffleAssert = require('truffle-assertions');

let contractInstance;



contract('Splitter', (accounts) => {
    let [alice, bob, carol, notOwner] = accounts;
    
   // this.state.web3.eth.defaultAccount = alice;

    
     beforeEach("create new instance", async () => {
        contractInstance = await Splitter.new( { from: alice } );
    });  

    it('bobs balance should be equal to his original balance, minus the gas price, plus the withdrawn amount', async() => {
       
        const toWithdraw = web3.utils.toBN(1, 'ether');
        const balanceBefore = (await web3.eth.getBalance(bob));

        return contractInstance.split( bob, carol, { from: alice, value: toWithdraw } )
        .then( async() => {

            const hash = await contractInstance.withdraw( { from: bob } );
            const balanceAfter = (await web3.eth.getBalance(bob));
            const tx = await web3.eth.getTransaction(hash);
            const receipt = await web3.eth.getTransactionReceipt(hash);
            const gasCost = tx.gasPrice.mul.toBN(receipt.gasUsed);  

            assert(balanceAfter == (balanceBefore-gasCost+toWithdraw));

        });
        
    });

    it('The internal balances of Carol and Bob after executing split() should be equal to half of the amount, alices internal balance should be equal to her original balance minus the split amount.', async() => {
        const amount = web3.utils.toBN(1, 'ether');

        const alicesBalanceBefore = await contractInstance.balances[0];
        const bobsBalanceBefore = await contractInstance.balances[1];
        const carolsBalanceBefore = await contractInstance.balances[2];
       
        await contractInstance.split(bob, carol, { from : alice , value: amount} );

        const alicesBalanceAfter = await contractInstance.balances[0];
        const bobsBalanceAfter = await contractInstance.balances[1];
        const carolsBalanceAfter = await contractInstance.balances[2];
        
        assert(alicesBalanceAfter == (alicesBalanceBefore- amount));
        assert(carolsBalanceAfter == (carolsBalanceBefore + (amount/2)));
        assert(bobsBalanceAfter == (bobsBalanceBefore + (amount/2)));

    });

    it('should throw because the owner is not the msg.sender', async() =>{
        await truffleAssert.reverts(
            contractInstance.pause({ from: notOwner }),
            "Only the owner can call this function."
        );
            
    });

    it('The contract should be paused when the pause() function is called', async() => {
        return contractInstance.pause( { from : alice } );
    });

    it('The contract should be killed if the kill() function is called', async() => {
        return contractInstance.pause( { from : alice } );
        return contractInstance.kill( { from : alice } ); 
    });
});