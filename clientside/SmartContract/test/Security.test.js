const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Security Contract", function () {
  let Security, security, owner, addr1, addr2;

  beforeEach(async function () {
    Security = await ethers.getContractFactory("Security");
    [owner, addr1, addr2] = await ethers.getSigners();
    security = await Security.deploy(owner.address, 1000); // Deploy with initial owner and max transaction limit
    await security.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await security.owner()).to.equal(owner.address);
    });

    it("Should set the max transaction limit", async function () {
      expect(await security.maxTransactionLimit()).to.equal(1000);
    });
  });

  describe("Ownership", function () {
    it("Should allow the owner to transfer ownership", async function () {
      await security.transferOwnership(addr1.address);
      expect(await security.owner()).to.equal(addr1.address);
    });

    it("Should prevent non-owners from transferring ownership", async function () {
      await expect(
        security.connect(addr1).transferOwnership(addr2.address)
      ).to.be.revertedWith("Caller is not the owner");
    });
  });

  describe("Whitelisting", function () {
    it("Should allow the owner to add an account to the whitelist", async function () {
      await security.addToWhitelist(addr1.address);
      expect(await security.whitelist(addr1.address)).to.be.true;
    });

    it("Should allow the owner to remove an account from the whitelist", async function () {
      await security.addToWhitelist(addr1.address);
      await security.removeFromWhitelist(addr1.address);
      expect(await security.whitelist(addr1.address)).to.be.false;
    });

    it("Should prevent non-owners from modifying the whitelist", async function () {
      await expect(
        security.connect(addr1).addToWhitelist(addr2.address)
      ).to.be.revertedWith("Caller is not the owner");
    });
  });

  describe("Pausing", function () {
    it("Should allow the owner to pause and unpause the contract", async function () {
      await security.pause();
      expect(await security.paused()).to.be.true;

      await security.unpause();
      expect(await security.paused()).to.be.false;
    });

    it("Should prevent non-owners from pausing or unpausing the contract", async function () {
      await expect(security.connect(addr1).pause()).to.be.revertedWith(
        "Caller is not the owner"
      );

      await security.pause();
      await expect(security.connect(addr1).unpause()).to.be.revertedWith(
        "Caller is not the owner"
      );
    });

    it("Should prevent certain actions when paused", async function () {
      await security.pause();
      await expect(security.addToWhitelist(addr1.address)).to.be.revertedWith(
        "Pausable: paused"
      );
    });
  });

  describe("Transaction Limits", function () {
    it("Should allow the owner to update the max transaction limit", async function () {
      await security.setMaxTransactionLimit(2000);
      expect(await security.maxTransactionLimit()).to.equal(2000);
    });

    it("Should enforce transaction limits on applicable functions", async function () {
      await expect(
        security.connect(addr1).withinTransactionLimit(1500)
      ).to.be.revertedWith("Transaction value exceeds limit");

      await expect(security.withinTransactionLimit(500)).to.not.be.reverted;
    });
  });

  describe("Reentrancy Guard", function () {
    it("Should prevent reentrant calls", async function () {
      // Since we have a basic contract, you would typically test this with a specific function
      // that could be vulnerable to reentrancy, but this placeholder shows the idea.
      await expect(security.nonReentrant()).to.not.be.reverted;
    });
  });
});
