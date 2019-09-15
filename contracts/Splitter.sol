pragma solidity ^0.5.0;

import "./SafeMath.sol";

import "./Killable.sol";
import "./Pausable.sol";

contract Splitter is Pausable, Killable {
    mapping (address => uint) public balances;
    event LogAmountSent(address indexed from, address indexed bob, address indexed carol, uint256 amount);
    event LogAmountWithdrawn( address indexed from, uint256 amount);
    
    using SafeMath for uint256;

    constructor() public {}

    function split(address bob, address carol) public payable onlyOwner whenRunning returns(bool success){
     require(msg.value != 0, "You need to send value");
     require(bob != address(0x0) && carol != address(0x0), "You need to pass valid addresses");
        uint256 remainder = msg.value.mod(2); 
        uint256 amount = msg.value.div(2);
        
        if(remainder != 0){
          balances[msg.sender] = balances[msg.sender].add(remainder);
        }
           
        balances[bob] = balances[bob].add(amount);
        balances[carol] = balances[carol].add(amount);
            
        emit LogAmountSent(msg.sender, bob, carol, msg.value); 
            
        return true;
    }
       
      function withdraw() public whenRunning returns(bool success) {
          uint256 toWithdraw = balances[msg.sender];
          require(toWithdraw != 0, "You don't have funds to withdraw");
        
        balances[msg.sender] = 0; 
        
        emit LogAmountWithdrawn(msg.sender, toWithdraw);
        msg.sender.transfer(toWithdraw);  
        
        
        return true;
            }
      
}