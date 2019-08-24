pragma solidity ^0.5.0;

contract Splitter {
    mapping (address => uint) public balance;
    uint256 amount;
    event Sent(address from, address bob, address carol, uint256 amount);
    event Withdraw ( address from, uint256 amount);
    
    constructor() public payable{}

    function sendSplit ( address payable bob, address payable carol) public payable returns(bool success){
     
    if(msg.value >= 1) {
        amount = msg.value/2;
            if(amount %2 != 0){
                amount -= 1; 
            }
        balance[bob] += amount;
        balance[carol] += amount; 
    
        emit Sent(msg.sender, bob, carol, amount); 
            }
        return true;
       }
       
      function withdraw() public {
        require(balance[msg.sender] >= 1);
          msg.sender.transfer(balance[msg.sender]); 
        emit Withdraw(msg.sender, balance[msg.sender]);
        
        balance[msg.sender] == 0; 
            }
       
}