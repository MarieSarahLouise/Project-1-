pragma solidity ^0.5.0;

contract Owner {
    address payable owner;

    constructor() public { owner = msg.sender; }

    modifier onlyOwner {
        require(
            msg.sender == owner,
            "Only the owner can call this function."
        );
        _;
    }

    function changeOwner(address payable newOwner) public {
        owner = newOwner;
    }

}