pragma solidity ^0.5.0;

import "./Ownable.sol";

contract Pausable is Ownable {

  event LogPause(address indexed sender);
  event LogResume(address indexed sender);
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
    emit LogPause(msg.sender);
  }

  function resume() public onlyOwner whenPaused {
    paused = false;
    emit LogResume(msg.sender);
  }

}