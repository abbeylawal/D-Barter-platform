const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

describe("NFTMarketplace Barter System", function () {
  let nftMarketplace, htlc, owner, addr1, addr2;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    const HTLC = await ethers.getContractFactory("HTLC");
    htlc = await HTLC.deploy();
    await htlc.deployed();

    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    nftMarketplace = await NFTMarketplace.deploy(htlc.address);
    await nftMarketplace.deployed();
  });

  it("Should create a token and listing", async function () {
    const tokenURI = "https://example.com/nft";
    const [tokenId, listingId] = await nftMarketplace.createTokenAndList(tokenURI);

    const listing = await nftMarketplace.getBarterListing(listingId);
    expect(listing.tokenId).to.equal(tokenId);
    expect(listing.itemOwner).to.equal(owner.address);
    expect(listing.isActive).to.be.true;
  });

  it("Should create a barter offer", async function () {
    const tokenURI = "https://example.com/nft";
    const [, listingId] = await nftMarketplace.createTokenAndList(tokenURI);

    const [offerTokenId] = await nftMarketplace.connect(addr1).createTokenAndList(tokenURI);
    await nftMarketplace.connect(addr1).createBarterOffer(listingId, offerTokenId);

    const offer = await nftMarketplace.getBarterOffer(1); // First offer
    expect(offer.listingId).to.equal(listingId);
    expect(offer.offerTokenId).to.equal(offerTokenId);
    expect(offer.offerer).to.equal(addr1.address);
    expect(offer.isActive).to.be.true;
  });

  it("Should accept a barter offer", async function () {
    const tokenURI = "https://example.com/nft";
    const [, listingId] = await nftMarketplace.createTokenAndList(tokenURI);

    const [offerTokenId] = await nftMarketplace.connect(addr1).createTokenAndList(tokenURI);
    await nftMarketplace.connect(addr1).createBarterOffer(listingId, offerTokenId);

    await nftMarketplace.acceptBarterOffer(listingId, 1); // Accept first offer
    const listing = await nftMarketplace.getBarterListing(listingId);
    const offer = await nftMarketplace.getBarterOffer(1);

    expect(listing.isActive).to.be.false;
    expect(offer.isActive).to.be.false;
  });

  it("Should confirm a barter transaction", async function () {
    const tokenURI = "https://example.com/nft";
    const [, listingId] = await nftMarketplace.createTokenAndList(tokenURI);

    const [offerTokenId] = await nftMarketplace.connect(addr1).createTokenAndList(tokenURI);
    await nftMarketplace.connect(addr1).createBarterOffer(listingId, offerTokenId);

    await nftMarketplace.acceptBarterOffer(listingId, 1); // Accept first offer

    await nftMarketplace.connect(addr1).confirmBarterTransaction(1); // Confirm by offerer
    await nftMarketplace.confirmBarterTransaction(1); // Confirm by lister

    const transaction = await nftMarketplace.getBarterTransaction(1);
    expect(transaction.status).to.equal(2); // Completed
  });

  it("Should cancel a barter transaction", async function () {
    const tokenURI = "https://example.com/nft";
    const [, listingId] = await nftMarketplace.createTokenAndList(tokenURI);

    const [offerTokenId] = await nftMarketplace.connect(addr1).createTokenAndList(tokenURI);
    await nftMarketplace.connect(addr1).createBarterOffer(listingId, offerTokenId);

    await nftMarketplace.acceptBarterOffer(listingId, 1); // Accept first offer

    await nftMarketplace.cancelBarterTransaction(1);

    const transaction = await nftMarketplace.getBarterTransaction(1);
    expect(transaction.status).to.equal(3); // Cancelled

    const listing = await nftMarketplace.getBarterListing(listingId);
    expect(listing.isActive).to.be.true;
  });
});