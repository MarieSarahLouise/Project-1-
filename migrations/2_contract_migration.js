var Splitter = artifacts.require("./splitter_contract.sol");

module.exports = function(deployer) {

  deployer.deploy(Splitter);
};
