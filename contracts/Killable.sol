pragma solidity ^0.5.0;

import "./Pausable.sol";

contract Killable is Ownable, Pausable{
    event LogKill(address owner, string message);
    
    bool private killed = false;

    modifier whenKilled() {
        require(killed, "The contract is still running.");
        _;
    }

    modifier whenAlive() {
        require(!killed, "The contract has already been killed.");
        _;
    }

    function kill() public onlyOwner whenPaused whenAlive{
        killed = true;
        emit LogKill(msg.sender, "The contract has been killed.");
    }

    function returnTheFunds() public payable onlyOwner whenKilled{
        require(msg.value == 0, "No value to return.");
        msg.sender.transfer(msg.value);
    }
}