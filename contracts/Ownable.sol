pragma solidity ^0.5.0;

contract Ownable {

    address private _isOwner;

    event LogChangedOwner(address indexed oldOwner, address indexed newOwner);
    constructor() public { _isOwner = msg.sender; }

    modifier onlyOwner {
        require(
            msg.sender == _isOwner,
            "Only the owner can call this function."
        );
        _;
    }

    function changedOwner(address newOwner) public onlyOwner {
        require (newOwner != address(0x0), "You need to pass a valid address");
        _isOwner = newOwner;
        emit LogChangedOwner(msg.sender, newOwner);
    }

    function isOwner() public view returns(address _owner){
        return _isOwner;
    }

}