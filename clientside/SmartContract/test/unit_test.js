const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTBarterMarketplace", function () {
  let NFTBarterMarketplace, nftBarterMarketplace, owner, addr1, addr2;

  beforeEach(async function () {
    NFTBarterMarketplace = await ethers.getContractFactory("NFTBarterMarketplace");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    nftBarterMarketplace = await NFTBarterMarketplace.deploy();
    await nftBarterMarketplace.deployed();
  });

  describe("Token Creation", function () {
    it("Should create a new token", async function () {
      await nftBarterMarketplace.createToken("https://example.com/token1");
      expect(await nftBarterMarketplace.ownerOf(1)).to.equal(owner.address);
    });
  });

  describe("Barter Listing", function () {
    beforeEach(async function () {
      await nftBarterMarketplace.createToken("https://example.com/token1");
    });

    it("Should create a barter listing", async function () {
      await nftBarterMarketplace.createBarterListing(1, 7);
      const listing = await nftBarterMarketplace.getBarterListing(1);
      expect(listing.tokenId).to.equal(1);
      expect(listing.owner).to.equal(owner.address);
      expect(listing.isActive).to.be.true;
    });

    it("Should fail to create a listing for a token the user doesn't own", async function () {
      await expect(nftBarterMarketplace.connect(addr1).createBarterListing(1, 7)).to.be.revertedWith("Only the owner can list the token for barter");
    });

    it("Should fail to create a listing with invalid duration", async function () {
      await expect(nftBarterMarketplace.createBarterListing(1, 0)).to.be.revertedWith("Duration must be between 1 and 30 days");
      await expect(nftBarterMarketplace.createBarterListing(1, 31)).to.be.revertedWith("Duration must be between 1 and 30 days");
    });
  });

  describe("Barter Offers", function () {
    beforeEach(async function () {
      await nftBarterMarketplace.createToken("https://example.com/token1");
      await nftBarterMarketplace.createBarterListing(1, 7);
      await nftBarterMarketplace.connect(addr1).createToken("https://example.com/token2");
    });

    it("Should make a barter offer", async function () {
      await nftBarterMarketplace.connect(addr1).makeBarterOffer(1, 2);
      const offers = await nftBarterMarketplace.getBarterOffers(1);
      expect(offers.length).to.equal(1);
      expect(offers[0].offeredTokenId).to.equal(2);
      expect(offers[0].offerer).to.equal(addr1.address);
    });

    it("Should fail to make an offer for a token the user doesn't own", async function () {
      await expect(nftBarterMarketplace.connect(addr2).makeBarterOffer(1, 2)).to.be.revertedWith("Only the owner can offer the token for barter");
    });
  });

  describe("Accepting Barter Offers", function () {
    beforeEach(async function () {
      await nftBarterMarketplace.createToken("https://example.com/token1");
      await nftBarterMarketplace.createBarterListing(1, 7);
      await nftBarterMarketplace.connect(addr1).createToken("https://example.com/token2");
      await nftBarterMarketplace.connect(addr1).makeBarterOffer(1, 2);
    });

    it("Should accept a barter offer", async function () {
      await nftBarterMarketplace.acceptBarterOffer(1, 2);
      expect(await nftBarterMarketplace.ownerOf(1)).to.equal(addr1.address);
      expect(await nftBarterMarketplace.ownerOf(2)).to.equal(owner.address);
    });

    it("Should fail to accept an offer for an inactive listing", async function () {
      await nftBarterMarketplace.cancelBarterListing(1);
      await expect(nftBarterMarketplace.acceptBarterOffer(1, 2)).to.be.revertedWith("Barter listing is not active");
    });

    it("Should fail to accept an offer if not the listing owner", async function () {
      await expect(nftBarterMarketplace.connect(addr2).acceptBarterOffer(1, 2)).to.be.revertedWith("Only the listing owner can accept an offer");
    });
  });

  describe("Cancelling Barter Listings", function () {
    beforeEach(async function () {
      await nftBarterMarketplace.createToken("https://example.com/token1");
      await nftBarterMarketplace.createBarterListing(1, 7);
    });

    it("Should cancel a barter listing", async function () {
      await nftBarterMarketplace.cancelBarterListing(1);
      const listing = await nftBarterMarketplace.getBarterListing(1);
      expect(listing.isActive).to.be.false;
    });

    it("Should fail to cancel a listing if not the owner", async function () {
      await expect(nftBarterMarketplace.connect(addr1).cancelBarterListing(1)).to.be.revertedWith("Only the listing owner can cancel the listing");
    });
  });

  describe("Relisting NFTs", function () {
    beforeEach(async function () {
      await nftBarterMarketplace.createToken("https://example.com/token1");
    });

    it("Should relist an NFT", async function () {
      await nftBarterMarketplace.relistNFT(1, 7);
      const listings = await nftBarterMarketplace.fetchAllListings();
      expect(listings.length).to.equal(1);
      expect(listings[0].tokenId).to.equal(1);
      expect(listings[0].owner).to.equal(owner.address);
      expect(listings[0].isActive).to.be.true;
    });

    it("Should fail to relist an NFT the user doesn't own", async function () {
      await expect(nftBarterMarketplace.connect(addr1).relistNFT(1, 7)).to.be.revertedWith("Only the owner can relist the token");
    });
  });

  describe("Fetching Listings and NFTs", function () {
    beforeEach(async function () {
      await nftBarterMarketplace.createToken("https://example.com/token1");
      await nftBarterMarketplace.createBarterListing(1, 7);
      await nftBarterMarketplace.connect(addr1).createToken("https://example.com/token2");
      await nftBarterMarketplace.connect(addr1).createBarterListing(2, 7);
    });

    it("Should fetch all listings", async function () {
      const listings = await nftBarterMarketplace.fetchAllListings();
      expect(listings.length).to.equal(2);
    });

    it("Should fetch my listings", async function () {
      const myListings = await nftBarterMarketplace.fetchMyListings();
      expect(myListings.length).to.equal(1);
      expect(myListings[0].tokenId).to.equal(1);
    });

    it("Should fetch my NFTs", async function () {
      const myNFTs = await nftBarterMarketplace.fetchMyNFTs();
      expect(myNFTs.length).to.equal(1);
      expect(myNFTs[0]).to.equal(1);
    });
  });
});