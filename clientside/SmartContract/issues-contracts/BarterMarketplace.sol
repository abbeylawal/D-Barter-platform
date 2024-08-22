// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Counter.sol";


// contract BarterMarketplace is ERC721URIStorage, ReentrancyGuard {
contract BarterMarketplace is ERC721URIStorage {
    using CounterLib for CounterLib.Counter;

    CounterLib.Counter private _tokenIds;
    CounterLib.Counter private _itemsSold;

    uint256 public constant LISTING_DURATION = 7 days;  // Duration for which a listing is active

    // Structure to represent a barter listing
    struct BarterListing {
        uint256 listingId;          // Unique ID for the listing
        uint256 tokenId;            // Token ID being listed
        address owner;              // Owner of the listed token
        string[] desiredCategories; // Categories of items the owner wants in exchange
        uint256 expirationTime;     // Expiration time of the listing
        bool isActive;              // Whether the listing is active
    }

    // Structure to represent a barter offer
    struct BarterOffer {
        uint256 listingId;          // ID of the listing being offered on
        uint256 offeredTokenId;     // Token ID being offered in exchange
        address offerer;            // Address of the person making the offer
        bool isAccepted;            // Whether the offer has been accepted
    }

    // Structure for Hash Time-Locked Contract (HTLC) to secure swaps
    struct HTLC {
        uint256 listingTokenId;     // Token ID from the listing
        uint256 offerTokenId;       // Token ID from the offer
        address listingOwner;       // Owner of the listed token
        address offerOwner;         // Owner of the offered token
        uint256 expirationTime;     // Expiration time of the HTLC
        bool isCompleted;           // Whether the swap is completed
    }

    // Mappings to store data
    mapping(uint256 => BarterListing) public listings;                  // Mapping from listing ID to BarterListing
    mapping(uint256 => BarterOffer[]) public offersForListing;          // Mapping from listing ID to array of BarterOffers
    mapping(uint256 => HTLC) public htlcs;                              // Mapping from HTLC ID to HTLC structure
    mapping(uint256 => string) public tokenCategories;                  // Mapping from token ID to its category

    // Events to log important actions
    event ItemCreated(uint256 tokenId, address owner, string category);
    event ListingCreated(uint256 listingId, uint256 tokenId, address owner, string[] desiredCategories);
    event OfferMade(uint256 listingId, uint256 offeredTokenId, address offerer);
    event OfferAccepted(uint256 listingId, uint256 offeredTokenId, address offerer);
    event SwapCompleted(uint256 listingTokenId, uint256 offerTokenId, address listingOwner, address offerOwner);

    constructor() ERC721("Barter Item", "BARTER") {}

    // Function to create a new NFT with a category and URI
    function createItem(string memory tokenURI, string memory category) public returns (uint256) {
        _tokenIds.increment();  // Increment the token ID counter
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);    // Mint the new token to the sender
        _setTokenURI(newTokenId, tokenURI); // Set the token URI
        tokenCategories[newTokenId] = category; // Assign the category to the token

        emit ItemCreated(newTokenId, msg.sender, category);  // Emit an event for item creation
        return newTokenId;
    }

    // Function to create a barter listing for an owned token
    function createListing(uint256 tokenId, string[] memory desiredCategories) public {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of this token");

        _listingIds.increment();  // Increment the listing ID counter
        uint256 newListingId = _listingIds.current();

        // Create a new listing and store it
        listings[newListingId] = BarterListing({
            listingId: newListingId,
            tokenId: tokenId,
            owner: msg.sender,
            desiredCategories: desiredCategories,
            expirationTime: block.timestamp + LISTING_DURATION,
            isActive: true
        });

        emit ListingCreated(newListingId, tokenId, msg.sender, desiredCategories);  // Emit an event for listing creation
    }

    // Function to make an offer on an active listing
    function makeOffer(uint256 listingId, uint256 offeredTokenId) public {
        BarterListing storage listing = listings[listingId];
        require(listing.isActive, "Listing is not active");
        require(block.timestamp < listing.expirationTime, "Listing has expired");
        require(ownerOf(offeredTokenId) == msg.sender, "You do not own the offered token");

        // Check if the offered token matches any of the desired categories
        bool categoryMatch = false;
        for (uint256 i = 0; i < listing.desiredCategories.length; i++) {
            if (keccak256(abi.encodePacked(tokenCategories[offeredTokenId])) == keccak256(abi.encodePacked(listing.desiredCategories[i]))) {
                categoryMatch = true;
                break;
            }
        }
        require(categoryMatch, "Offered token category does not match any of the desired categories");

        // Add the offer to the listing's offers array
        offersForListing[listingId].push(BarterOffer({
            listingId: listingId,
            offeredTokenId: offeredTokenId,
            offerer: msg.sender,
            isAccepted: false
        }));

        emit OfferMade(listingId, offeredTokenId, msg.sender);  // Emit an event for offer creation
    }

    // Function to accept an offer on a listing
    function acceptOffer(uint256 listingId, uint256 offerIndex) public {
        BarterListing storage listing = listings[listingId];
        require(listing.owner == msg.sender, "You are not the owner of this listing");
        require(listing.isActive, "Listing is not active");
        require(offerIndex < offersForListing[listingId].length, "Invalid offer index");

        BarterOffer storage offer = offersForListing[listingId][offerIndex];
        require(!offer.isAccepted, "This offer has already been accepted");

        offer.isAccepted = true;
        listing.isActive = false;  // Mark the listing as inactive

        // Generate a unique ID for the HTLC using a hash of listingId, offerIndex, and the current timestamp
        uint256 htlcId = uint256(keccak256(abi.encodePacked(listingId, offerIndex, block.timestamp)));

        // Create and store the HTLC
        htlcs[htlcId] = HTLC({
            listingTokenId: listing.tokenId,
            offerTokenId: offer.offeredTokenId,
            listingOwner: msg.sender,
            offerOwner: offer.offerer,
            expirationTime: block.timestamp + 1 days,  // Set a 1-day expiration for the HTLC
            isCompleted: false
        });

        emit OfferAccepted(listingId, offer.offeredTokenId, offer.offerer);  // Emit an event for offer acceptance
    }

    // Function to complete the swap between two parties
    function completeSwap(uint256 htlcId) public nonReentrant {
        HTLC storage htlc = htlcs[htlcId];
        require(!htlc.isCompleted, "Swap has already been completed");
        require(block.timestamp <= htlc.expirationTime, "HTLC has expired");
        require(msg.sender == htlc.listingOwner || msg.sender == htlc.offerOwner, "You are not a participant in this swap");

        // Perform the swap
        if (msg.sender == htlc.listingOwner) {
            _transfer(htlc.listingOwner, htlc.offerOwner, htlc.listingTokenId);
        } else {
            _transfer(htlc.offerOwner, htlc.listingOwner, htlc.offerTokenId);
        }

        // Mark the swap as completed if both transfers were successful
        if (ownerOf(htlc.listingTokenId) == htlc.offerOwner && ownerOf(htlc.offerTokenId) == htlc.listingOwner) {
            htlc.isCompleted = true;
            emit SwapCompleted(htlc.listingTokenId, htlc.offerTokenId, htlc.listingOwner, htlc.offerOwner);  // Emit an event for swap completion
        }
    }

    // Function to get all active listings
    function getListings() public view returns (BarterListing[] memory) {
        uint256 activeCount = 0;

        // Count active listings
        for (uint256 i = 1; i <= _listingIds.current(); i++) {
            if (listings[i].isActive && block.timestamp < listings[i].expirationTime) {
                activeCount++;
            }
        }

        // Collect active listings
        BarterListing[] memory activeListings = new BarterListing[](activeCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= _listingIds.current(); i++) {
            if (listings[i].isActive && block.timestamp < listings[i].expirationTime) {
                activeListings[index] = listings[i];
                index++;
            }
        }

        return activeListings;
    }
}