// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC20Interface.sol";

contract ERC20Token is ERC20Interface {
    uint256 private constant MAX_UINT256 = type(uint256).max;

    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowed;

    uint256 public totSupply;
    string public name;
    uint8 public decimals;
    string public symbol;

    constructor(
        uint256 initialAmount,
        string memory tokenName,
        uint8 decimalUnits,
        string memory tokenSymbol
    ) {
        balances[msg.sender] = initialAmount;
        totSupply = initialAmount;
        name = tokenName;
        decimals = decimalUnits;
        symbol = tokenSymbol;
    }

    function transfer(address to, uint256 value) public returns (bool success) {
        require(
            balances[msg.sender] >= value,
            "Insufficient funds for transfer source"
        );
        balances[msg.sender] -= value;
        balances[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public returns (bool success) {
        uint256 currentAllowance = allowed[from][msg.sender];
        require(
            balances[from] >= value && currentAllowance >= value,
            "Insufficient allowed funds for transfer source"
        );
        balances[to] += value;
        balances[from] -= value;
        if (currentAllowance < MAX_UINT256) {
            allowed[from][msg.sender] = currentAllowance - value;
        }
        emit Transfer(from, to, value);
        return true;
    }

    function balanceOf(address owner) public view returns (uint256 balance) {
        return balances[owner];
    }

    function approve(address spender, uint256 value) public returns (bool success) {
        allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function allowance(
        address owner,
        address spender
    ) public view returns (uint256 remaining) {
        return allowed[owner][spender];
    }

    function totalSupply() public view returns (uint256) {
        return totSupply;
    }
}
