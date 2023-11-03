//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19;

contract PetAdoption {
    address public owner;

    constructor() {
        owner = msg.sender;
    }
}
