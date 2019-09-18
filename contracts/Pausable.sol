pragma solidity ^0.5.0;

import "./Ownable.sol";

contract Pausable is Ownable {

  event LogPause(address indexed owner, string indexed message);
  event LogResume(address indexed owner, string indexed message);
  bool private paused = false;

  modifier whenRunning() {
    require(!paused, "The contract is paused");
    _;
  }

  modifier whenPaused() {
    require(paused, "The contract is running");
    _;
  }

  function pause() public onlyOwner whenRunning {
    paused = true;
    emit LogPause(msg.sender,"The contact has been paused" );
  }

  function resume() public onlyOwner whenPaused {
    paused = false;
    emit LogResume(msg.sender, "The contract has been resumed");
  }

}