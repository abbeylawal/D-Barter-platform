// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";
import "./Counter.sol";

contract NFTMarketplace is ERC721URIStorage {
    using CounterLib for CounterLib.Counter;

    CounterLib.Counter private _tokenIds;
    CounterLib.Counter private _listingIds;

    address public owner;

    struct BarterListing {
        uint256 listingId;
        uint256 tokenId;
        address owner;
        uint256 expirationTime;
        bool isActive;
    }

    mapping(uint256 => BarterListing) private idToBarterListing;

    event BarterListingCreated(uint256 indexed listingId, uint256 indexed tokenId, address owner, uint256 expirationTime);

    constructor() ERC721("Barter NFT", "BNFT") {
        owner = msg.sender;
    }

    function createTokenAndList(string memory tokenURI) public returns (uint256, uint256) {
        uint256 defaultDurationInDays = 7;

        // Increment and create the token
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        // Increment and create the listing
        _listingIds.increment();
        uint256 listingId = _listingIds.current();
        uint256 expirationTime = block.timestamp + (defaultDurationInDays * 1 days);

        idToBarterListing[listingId] = BarterListing(
            listingId,
            newTokenId,
            msg.sender,
            expirationTime,
            true
        );

        emit BarterListingCreated(listingId, newTokenId, msg.sender, expirationTime);

        return (newTokenId, listingId);
    }

    function getBarterListing(uint256 listingId) public view returns (BarterListing memory) {
        return idToBarterListing[listingId];
    }

    function fetchAllListings() public view returns (BarterListing[] memory) {
        uint totalListingCount = _listingIds.current();
        uint currentIndex = 0;

        BarterListing[] memory listings = new BarterListing[](totalListingCount);

        for (uint i = 1; i <= totalListingCount; i++) {
            BarterListing storage currentListing = idToBarterListing[i];
            if (currentListing.isActive) {
                listings[currentIndex] = currentListing;
                currentIndex++;
            }
        }

        // Resize the array to remove empty slots
        assembly {
            mstore(listings, currentIndex)
        }

        return listings;
    }
}