pragma solidity ^0.5.0;

import "./Ownable.sol";

contract Pausable is Ownable {

  event LogPause();
  event LogResume();
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
    emit LogPause();
  }

  function resume() public onlyOwner whenPaused {
    paused = false;
    emit LogResume();
  }

}