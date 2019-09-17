pragma solidity ^0.5.0;

import "./Pausable.sol";

contract Killable is Ownable, Pausable{

    event LogKill(address owner, string status );

    bool killed;

    constructor() public {killed;}

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
        require(address(this).balance == 0, "No value in the contract");
        msg.sender.transfer(address(this).balance);
    }
}