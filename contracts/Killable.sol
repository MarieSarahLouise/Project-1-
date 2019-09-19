pragma solidity ^0.5.0;

import "./Pausable.sol";

contract Killable is Ownable, Pausable{

    event LogKill(address indexed owner, string indexed status );

    bool private killed;

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

    function returnTheFunds() external onlyOwner whenKilled{
        require(address(this).balance != 0, "No value in the contract");
        uint256 amount = address(this).balance;
        (bool success, ) = msg.sender.call.value(amount)("");
        require(success, "Refund failed");
    }
}