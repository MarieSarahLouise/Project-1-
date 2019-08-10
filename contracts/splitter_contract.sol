pragma solidity ^0.5.0;

contract Splitter {
    address alice = msg.sender; 
    mapping (address => uint) balance;

    event Sent(address from, address to, uint256 amount);

    constructor() public payable{}

    function sendSplit ( uint256 amount ) public payable{
    amount = msg.value/2* 1 ether;
    require(amount <= balance[alice]);

       address payable bob = 0x4FcD08ed2F41541A9bA64c9f423E00c3103CcB0F;
       address payable carol = 0x195CB57EB007eF4073D462aa944556F19843D553;
    
        bob.transfer(amount);
        carol.transfer(amount); 
        
        balance[alice] -= msg.value; 
        balance[bob] += amount;
        balance[carol] += amount; 
        
        emit Sent(alice, bob, amount); 
        emit Sent(alice, carol, amount);
       }
    }
