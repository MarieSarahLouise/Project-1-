var Splitter = artifacts.require("./Splitter.sol");
var SafeMath = artifacts.require("./SafeMath.sol");
var Pausable = artifacts.require("./Pausable.sol");
var Killable = artifacts.require("./Killable.sol");
var Ownable = artifacts.require("./Ownable.sol");

module.exports = function(deployer) {

  deployer.deploy(Splitter);
  
};
