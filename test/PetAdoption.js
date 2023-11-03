const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("PetAdoption", function () {
  async function deployContractFixture() {
    const PETS_COUNT = 5;
    const ADOPTED_PET_IDX = 0;
    const [owner, account2, account3] = await ethers.getSigners();
    const PetAdoption = await ethers.getContractFactory("PetAdoption");
    const contract = await PetAdoption.deploy(PETS_COUNT);

    await contract.connect(account3).adoptPet(ADOPTED_PET_IDX);

    const randomNum = Math.random();

    return {
      owner,
      account2,
      account3,
      contract,
      randomNum,
      petsAddedCount: PETS_COUNT,
      adoptedPetIdx: ADOPTED_PET_IDX,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { owner, contract, ...rest } = await loadFixture(
        deployContractFixture
      );
      const contractOwner = await contract.owner();

      //   console.log("R1: " + randomNum);
      console.log("Contract Owner: " + contractOwner);
      console.log("Deployer: " + owner.address);

      expect(await contract.owner()).to.equal(owner.address);
    });

    it("getOwner() should return the right owner", async function () {
      const { owner, contract, ...rest } = await loadFixture(
        deployContractFixture
      );
      const contractOwner = await contract.getOwner();

      //   console.log("R2: " + randomNum);

      expect(await contract.owner()).to.equal(owner.address);
    });
  });

  describe("Add Pet", function () {
    it("Should revert with the right error in case of other account", async function () {
      const { contract, account2 } = await loadFixture(deployContractFixture);

      await expect(contract.connect(account2).addPet()).to.be.revertedWith(
        "Only a contract owner can add a new pet!"
      );
    });

    it("Should increase pet index", async function () {
      const { contract, petsAddedCount } = await loadFixture(
        deployContractFixture
      );

      await contract.addPet();

      expect(await contract.petIndex()).to.equal(petsAddedCount + 1);
    });
  });

  describe("Adopt Pet", function () {
    it("Should revert Index out of bounds", async function () {
      const { contract, petsAddedCount } = await loadFixture(
        deployContractFixture
      );

      await expect(contract.adoptPet(petsAddedCount)).to.be.revertedWith(
        "Pet index out of bounds!"
      );
      await expect(contract.adoptPet(-1)).to.be.rejectedWith(
        "value out-of-bounds "
      );
    });

    it("Should revert with pet is already adopted", async function () {
      const { contract, adoptedPetIdx } = await loadFixture(
        deployContractFixture
      );

      await expect(contract.adoptPet(adoptedPetIdx)).to.be.revertedWith(
        "Pet is already adopted!"
      );
    });
  });
});

//npx hardhat test --network hardhat ==> test the contract on hardhat
//npx hardhat test --network localhost ==> test the contract on localhost
