const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
  let marketplace;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Deploy the NFTMarketplace contract
    const Marketplace = await ethers.getContractFactory("NFTMarketplace");

    // Deploy the contract and wait until it's mined
    marketplace = await Marketplace.deploy();

    // Get the signers
    [owner, addr1, addr2, _] = await ethers.getSigners();
  });

  it("Should create an NFT and verify its details", async function () {
    // Create a new NFT
    const tokenURI = "https://example.com/nft";
    await marketplace.createToken(tokenURI);

    // Fetch the NFT details
    const tokenId = 1; // Assuming first token has ID 1
    const fetchedTokenURI = await marketplace.tokenURI(tokenId);

    // Check if the tokenURI matches
    expect(fetchedTokenURI).to.equal(tokenURI);
  });

  it("Should list an NFT for barter", async function () {
    const tokenURI = "https://example.com/nft";
    await marketplace.createToken(tokenURI);

    const tokenId = 1;
    const durationInDays = 30;

    // List the NFT for barter
    await marketplace.createBarterListing(tokenId, durationInDays);

    const listings = await marketplace.fetchAllListings();

    // Check if the listing exists and is active
    expect(listings.length).to.equal(1);
    expect(listings[0].isActive).to.equal(true);
  });

  it("Should make and accept a barter offer", async function () {
    const tokenURI1 = "https://example.com/nft1";
    const tokenURI2 = "https://example.com/nft2";

    // Create two NFTs
    await marketplace.createToken(tokenURI1);
    await marketplace.createToken(tokenURI2);

    const tokenId1 = 1;
    const tokenId2 = 2;

    const durationInDays = 30;

    // List the first NFT for barter
    await marketplace.createBarterListing(tokenId1, durationInDays);

    // Make an offer with the second NFT
    await marketplace.connect(addr1).makeBarterOffer(1, tokenId2);

    // Accept the barter offer
    await marketplace.acceptBarterOffer(1, tokenId2);

    // Verify the offer was accepted
    const listings = await marketplace.fetchAllListings();
    expect(listings[0].isActive).to.equal(false);
  });

  it("Should fetch all NFTs correctly", async function () {
    const tokenURI1 = "https://example.com/nft1";
    const tokenURI2 = "https://example.com/nft2";

    await marketplace.createToken(tokenURI1);
    await marketplace.createToken(tokenURI2);

    const nfts = await marketplace.fetchAllListings();

    // Verify both NFTs are returned
    expect(nfts.length).to.equal(2);
    expect(nfts[0].tokenURI).to.equal(tokenURI1);
    expect(nfts[1].tokenURI).to.equal(tokenURI2);
  });

  it("Should cancel a barter listing", async function () {
    const tokenURI = "https://example.com/nft";
    await marketplace.createToken(tokenURI);

    const tokenId = 1;
    const durationInDays = 30;

    await marketplace.createBarterListing(tokenId, durationInDays);

    await marketplace.cancelBarterListing(1);

    const listings = await marketplace.fetchAllListings();

    // Verify the listing was cancelled
    expect(listings[0].isActive).to.equal(false);
  });
});
