pragma solidity ^0.5.0;

import "./Owner.sol";

contract Kill is Owner{
    event LogKill(address owner, string message);
    
    function kill() public onlyOwner{
        selfdestruct(owner);
        emit LogKill(owner, "The contract was killed.");
    }
}