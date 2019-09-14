pragma solidity ^0.5.0;

contract Ownable {
    address private owner;

    constructor() public { owner = msg.sender; }

    modifier onlyOwner {
        require(
            msg.sender == owner,
            "Only the owner can call this function."
        );
        _;
    }

    function changeOwner(address payable newOwner) public onlyOwner {
        require (newOwner != address(0x0), "You need to pass a valid address");
        owner = newOwner;
    }

}