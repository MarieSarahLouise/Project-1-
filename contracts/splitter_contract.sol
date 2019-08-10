pragma solidity ^0.5.0;

contract Splitter {
    address alice = msg.sender; 
    mapping (address => uint) balance;

    event Sent(address from, address bob, address carol, uint256 amount);

    constructor() public payable{}

    function sendSplit ( uint256 amount ) public payable{
    require(msg.value <= balance[alice]);
    amount = msg.value;
    uint256 Amount = amount/2* 1 ether;

       address payable bob = 0x4FcD08ed2F41541A9bA64c9f423E00c3103CcB0F;
       address payable carol = 0x195CB57EB007eF4073D462aa944556F19843D553;
    
        bob.transfer(amount);
        carol.transfer(amount); 
        
        balance[alice] -= msg.value; 
        balance[bob] += amount;
        balance[carol] += amount; 
        
        emit Sent(alice, bob, carol, amount); 
        
       }
    }
