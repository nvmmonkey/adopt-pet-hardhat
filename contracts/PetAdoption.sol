//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19;

contract PetAdoption {
    address public owner;
    uint public petIndex = 0;
    uint[] public allAdoptedPets;

    mapping(uint => address) public petIdxToOwnerAddress;
    mapping(address => uint[]) public ownerAddressToPetList;

    constructor(uint initialPetIndex) {
        owner = msg.sender;
        petIndex = initialPetIndex;
    }

    function addPet() public {
        require(
            msg.sender == owner,
            "Only a contract owner can add a new pet!"
        );
        petIndex++;
    }

    function adoptPet(uint adoptIdx) public {
        require(adoptIdx < petIndex, "Pet index out of bounds!");
        require(
            petIdxToOwnerAddress[adoptIdx] == address(0),
            "Pet is already adopted!"
        );

        petIdxToOwnerAddress[adoptIdx] = msg.sender; //map pet_3 => 0xabc..abc
        ownerAddressToPetList[msg.sender].push(adoptIdx); //map 0xabc..abc => pet_3
        allAdoptedPets.push(adoptIdx); //push adoptPetIndex to allAdoptedPets Array =>[3]
    } 

    function getOwner() public view returns (address) {
        return owner;
    }

    
}
