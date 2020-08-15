//SPDX-License-Identifier:unlicensed
pragma solidity >=0.5.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Rep is ERC20 {
    constructor() public ERC20("Augur token", "REP") {}

    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
