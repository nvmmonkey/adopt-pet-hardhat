const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("PetAdoption", function () {
  async function deployContractFixture() {
    const [owner] = await ethers.getSigners();
    const PetAdoption = await ethers.getContractFactory("PetAdoption");
    const contract = await PetAdoption.deploy();

    const randomNum = Math.random();

    return { owner, contract, randomNum};
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { owner, contract, ...rest } = await loadFixture(deployContractFixture);
      const contractOwner = await contract.owner();

    //   console.log("R1: " + randomNum);
      console.log("Contract Owner: " + contractOwner);
      console.log("Deployer: " + owner.address);

      expect(await contract.owner()).to.equal(owner.address);
    });

    it("getOwner() should return the right owner", async function () {
      const { owner, contract, ...rest } = await loadFixture(deployContractFixture);
      const contractOwner = await contract.getOwner();

    //   console.log("R2: " + randomNum);

      expect(await contract.owner()).to.equal(owner.address);
    });
  });
});

//npx hardhat test --network hardhat ==> test the contract
