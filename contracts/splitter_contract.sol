pragma solidity ^0.5.0;

contract splitter_contract {
    mapping (address => uint) public balances;
    event Sent(address from, address bob, address carol, uint256 amount);
    event Withdraw ( address from, uint256 amount);
    
    constructor() public payable{}

    function sendSplit ( address bob, address carol) public payable returns(bool success){
     require(msg.value>0, "You need to send value");
     
        uint remainder = msg.value % 2; 
        uint256 amount = (msg.value-remainder)/2;
        
        if(remainder != 0){
        balances[msg.sender] += remainder;
            
        }
           
        balances[bob] += amount;
        balances[carol] += amount; 
            
        emit Sent(msg.sender, bob, carol, msg.value); 
            
        return true;
    }
       
      function withdraw() public returns(bool success) {
          uint256 toWithdraw = balances[msg.sender];
        require(toWithdraw >= 1);
        
        balances[msg.sender] == 0; 
        
        emit Withdraw(msg.sender, toWithdraw);
        msg.sender.transfer(toWithdraw);  
        
        
        return true;
            }
       
}