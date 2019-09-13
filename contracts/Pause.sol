pragma solidity ^0.5.0;

import "./Owner.sol";

contract Pause is Owner {

  event LogPause();
  event LogResume();
  bool public paused = false;

  modifier whenNotPaused() {
    require(!paused, "The contract is paused");
    _;
  }

  modifier whenPaused() {
    require(paused, "The contract is not paused");
    _;
  }

  function pause() public onlyOwner whenNotPaused {
    paused = true;
    emit LogPause();
  }

  function resume() public onlyOwner whenPaused {
    paused = false;
    emit LogResume();
  }

}