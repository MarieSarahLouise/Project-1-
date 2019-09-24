pragma solidity ^0.5.0;

import "./Pausable.sol";

contract Killable is Pausable{

    event LogKill(address indexed owner);
    
    bool killed;

    constructor() public {}

    modifier whenKilled() {
        require(killed, "The contract is still running.");
        _;
    }

    modifier whenAlive() {
        require(!killed, "The contract has already been killed.");
        _;
    }

    function getKilledStatus() external returns(bool killedStatus) {
        killedStatus = killed;
        return killedStatus;
    }
    function kill() public onlyOwner whenPaused whenAlive{
        killed = true;
        emit LogKill(msg.sender);
    }

    function returnTheFunds() external onlyOwner whenKilled{
        require(address(this).balance != 0, "No value in the contract");
        (bool success, ) = msg.sender.call.value(address(this).balance)("");
        require(success, "Refund failed");
    }
}