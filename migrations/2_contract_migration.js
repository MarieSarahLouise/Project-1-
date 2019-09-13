var Splitter = artifacts.require("./Splitter.sol");
var SafeMath = artifacts.require("./SafeMath.sol");
var Pause = artifacts.require("./Pause.sol");
var Kill = artifacts.require("./Kill.sol");
var Owner = artifacts.require("./Owner.sol");

module.exports = function(deployer) {

  deployer.deploy(SafeMath);
  deployer.deploy(Owner);
  deployer.deploy(Pause);
  deployer.deploy(Kill);
  deployer.link(SafeMath, Splitter, Pause, Kill, Owner);
  deployer.deploy(Splitter);
  
};
