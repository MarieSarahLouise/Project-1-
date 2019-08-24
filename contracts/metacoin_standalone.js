const Web3 = require('web3');
const web3 = new Web3();

const Ganache = require('ganache-cli');
Web3.setProvider(Ganache.prodvider());

const assert = require('assert-plus');
const truffleContract = require("truffle-contract");

const ConvertLib = truffleContract(require(__dirname + "/../build/contracts/ConvertLib.json"));
ConvertLib.setProvider(web3.currentProvider);

const MetaCoin = truffleContract(require(__dirname+ "/../build/contracts/MetaCoin.json"));
MetaCoin.setProvider(web3.currentProvider);


