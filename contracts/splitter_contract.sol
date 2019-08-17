pragma solidity ^0.5.0;

contract Splitter {
    address alice; 
    mapping (address => uint) public balance;
    uint256 amount;
    event Sent(address from, address bob, address carol, uint256 amount);
    
    constructor() public payable{
        alice = msg.sender; 
    }

    function sendSplit ( address payable bob, address payable carol) public payable returns(bool success){
     
    if(msg.value < 0) {
       require(msg.value <= balance[alice]);
        amount = msg.value/2;
    
        balance[alice] -= msg.value; 
        balance[bob] += amount;
        balance[carol] += amount; 
    
        emit Sent(alice, bob, carol, amount); 
            }
        return true;
       }
      function withdraw() public {
        require(balance[msg.sender]>0);
        msg.sender.transfer(balance[msg.sender]);
            }
       
}