require("file-loader?name=../index.html!../index.html");
const Web3 = require("web3");
const truffleContact = require("truffle-contract");
const $ = require("jquery");
const slpitterJson = require("../../build/contracts/Splitter.json");

window.addEventListener('load', async function(){
    if (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined') {

        window.web3 = new Web3(window.ethereum || window.web3.currentProvider);
    } else {
        window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    }
    const Splitter = truffleContact(slpitterJson);
    Splitter.setProvider(web3.currentProvider);
    
    const displayMyAccounts =  accounts => {
    try {
        if(accounts.length == 0) {
            $("#balance").html("N/A");
            throw new Error("No account with which to transact.");
        }
    } catch(err) {
        console.error(err);
    }};

    if (typeof ethereum !== 'undefined') {
        $("#allowMyAddresses").click(async () => {
            try {
                displayMyAccounts(await ethereum.enable());
            } catch(err) {
                console.error(err);
            }
        });
    } else {
        try {
            displayMyAccounts(await window.web3.eth.getAccounts());
        } catch(error) {
            $("#myAddresses").html(`Failed to get your addresses: ${ error }`);
        }        
    }
});

    const sendSplit = async function() {
        const gas = 300000;
        const arguments =  [
            $("input[name = 'bob']").val(), 
            $("input[name = 'carol']").val(),
            $("input[name = 'amount']").val(),
            { from: window.account, gas : gas }];
            
        try { 
        const deployed = await Splitter.deployed();
        const success = await deployed.sendSplit.call.apply(deployed, arguments);
            if(!success){
                throw new Error("The transaction will fail anyway, not sending.");
            }
        const txObj = await deployed.sendSplit.apply(deployed, arguments);
        const receipt = await txObj.receipt;
        console.log("got receipt", receipt);
            
        if (!receipt.status) {
            console.error("Wrong status");
            console.error(receipt);
            $("#status").html("There was an error in the tx execution, status not 1");
        } else if (receipt.logs.length == 0) {
            console.error("Empty logs");
            console.error(receipt);
            $("#status").html("There was an error in the tx execution, missing expected event");
        } else {
            console.log(receipt.logs[0]);
            $("#status").html("Transfer executed");
        }
        }
        catch(e) {
            console.error(e);
        };  
    };

            
       



