pragma solidity ^0.5.0;

contract Splitter {
    mapping (address => uint) public balance;
    uint256 amount;
    event Sent(address from, address bob, address carol, uint256 amount);
    event Withdraw ( address from, uint256 amount);
    
    constructor() public payable{}

    function sendSplit ( address payable bob, address payable carol) public payable returns(bool success){
     require(msg.value>0, "You need to send value");
     
        uint remainder = msg.value % 2; 
        amount = (msg.value-remainder)/2;
        balance[msg.sender] += remainder; 
           
        balance[bob] += amount;
        balance[carol] += amount; 
            
        emit Sent(msg.sender, bob, carol, msg.value); 
            
        return true;
    }
       
      function withdraw() public returns(bool success) {
        require(balance[msg.sender] >= 1);
        emit Withdraw(msg.sender, balance[msg.sender]);
        msg.sender.transfer(balance[msg.sender]);  
        balance[msg.sender] == 0; 
        
        return true;
            }
       
}