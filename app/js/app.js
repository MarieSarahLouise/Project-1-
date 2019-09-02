const Web3 = require("web3");
const Promise = require("bluebird");
const truffleContact = require("truffle-contract");
const $ = require("jquery");
const slpitterJson = require("../../build/contracts/Spitter.json");

if (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined'){
    window.web3 = new Web3(window.ethereum || window.Web3.currentProvider);
} else {
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

const Splitter = truffleContact(slpitterJson);
Splitter.setProvider(web3.currentProvider);

require("file-loader?name=./index.html!../index.html");

window.addEventListener('load', async function(){
    try {
        const accounts = await (
            web3.eth.getAccounts()
        );
        if(accounts.length == 0) {
            $("#balance").html("N/A");
            throw new Error("No account with which to transact");
        }
        this.window.account = accounts[0];
        console.log("Accout: ", window.account);
        const network = await web3.eth.net.getId();
        console.log("Network: ", network.toString(10));
        const deployed = await Splitter.deployed();
        const balance = await deployed.getBalance.call(window.account);
        $('#balance').html(balance.toString(10));
    } catch(err) {
        console.error(err);
    }
});

const sendSplit = async function(){
    try {
        const deployed = await Splitter.deployed();
        const success = await deployed.sendSplit.call(
            $("input[name = 'bob']").val(), 
            $("input[name = 'carol']").val(),
            $("input[name = 'amount']").val(),
            { from: window.account, gas: gas});
        if(!success) {
            throw new Error("The transaction will fail, not sending");
        }
        const txObj = await deployed.sendSplit(
            $("input[name = 'bob']").val(), 
            $("input[name = 'carol']").val(),
            $("input[name = 'amount']").val(),
            { from: window.account, gas: gas })
            .on("transactionHash", 
            txHash => $("#status").html("Transact on the way " + txhash));
            const receipt = txObj.receipt;
            console.log("got receipt", receipt);
            if(!receipt.status) {
                console.error("Wrong status");
                console.error(receipt);
                $("#status").html("There was a errorin the tx execution, status not 1");
            } else if(receipt.logs.length == 0) {
             console.error("Empty logs");
             console.error(receipt);
             $("#status").html("There was an error in the tx execution, missing expected event.");   
            } else {
                console.log(receipt.logs[0]);
                $("#status").html("Transfer executed");
            }
            const balance = await deployed.getBalance.call(window.account);
            $("#balance").html(balance.toString(10));
    }
};
