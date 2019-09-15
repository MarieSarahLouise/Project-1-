pragma solidity ^0.5.0;

import "./Ownable.sol";

contract Killable is Ownable {
    event LogKill(address owner, string message);
    
    bool private killed = false;

    modifier whenKilled() {
        require(killed, "The contract is still running.");
        _;
    }

    function kill() public onlyOwner{
        require(!killed);
        killed = true;
        emit LogKill(msg.sender, "The contract has been killed.");
    }

    function returnTheFunds() public payable onlyOwner whenKilled{
        require(msg.value < 0, "No value to refund.");
        msg.sender.transfer(msg.value);
    }
}