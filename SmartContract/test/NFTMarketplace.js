const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
  let NFTMarketplace, nftMarketplace, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.deployed();
  });

  it("Should set the right owner", async function () {
    expect(await nftMarketplace.owner()).to.equal(owner.address);
  });

  it("Should create and execute market sales", async function () {
    // Create a new token
    await nftMarketplace.createToken(
      "https://example.com",
      ethers.utils.parseEther("1"),
      { value: ethers.utils.parseEther("0.0005") }
    );

    // List token for sale
    await nftMarketplace.createMarketItem(1, ethers.utils.parseEther("1"));

    // Buy the token
    await nftMarketplace
      .connect(addr1)
      .createMarketSale(1, { value: ethers.utils.parseEther("1") });

    expect(await nftMarketplace.ownerOf(1)).to.equal(addr1.address);
  });
});
