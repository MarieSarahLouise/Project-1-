pragma solidity ^0.5.0;

import "./Ownable.sol";

contract Pausable is Ownable {

  event LogPaused(address indexed sender);
  event LogResumed(address indexed sender);

  bool private _isPaused;
 
  modifier whenRunning() {
    require(!_isPaused, "The contract is paused");
    _;
  }

  modifier whenPaused() {
    require(_isPaused, "The contract is running");
    _;
  }

  function isPaused() public view returns(bool _paused) {
    return _isPaused;
  }

  function pause() public onlyOwner whenRunning {
    _isPaused = true;
    emit LogPaused(msg.sender);
  }

  function resume() public onlyOwner whenPaused {
    _isPaused = false;
    emit LogResumed(msg.sender);
  }

}