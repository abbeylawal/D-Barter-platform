// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";
import "./Counter.sol";

contract NFTMarketplace is ERC721URIStorage {
    using CounterLib for CounterLib.Counter;

    CounterLib.Counter private _tokenIds;
    CounterLib.Counter private _itemsSold;
    CounterLib.Counter private _listingIds;

    address public owner;

    struct BarterListing {
        uint256 listingId;
        uint256 tokenId;
        address owner;
        uint256 expirationTime;
        bool isActive;
    }

    struct BarterOffer {
        uint256 offeredTokenId;
        address offerer;
        bool isAccepted;
    }

    mapping(uint256 => BarterListing) private idToBarterListing;
    mapping(uint256 => BarterOffer[]) private listingIdToOffers;

    event BarterListingCreated(uint256 indexed listingId, uint256 indexed tokenId, address owner, uint256 expirationTime);
    event BarterOfferMade(uint256 indexed listingId, uint256 indexed offeredTokenId, address offerer);
    event BarterOfferAccepted(uint256 indexed listingId, uint256 indexed acceptedTokenId, address acceptedOfferer);
    event BarterCompleted(uint256 indexed listingId, uint256 indexed listedTokenId, uint256 indexed barteredTokenId);

    constructor() ERC721("Barter NFT", "BNFT") {
        owner = msg.sender;
    }

    function createToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        return newTokenId;
    }

    function createBarterListing(uint256 tokenId, uint256 durationInDays) public {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can list the token for barter");
        require(durationInDays > 0 && durationInDays <= 30, "Duration must be between 1 and 30 days");

        _listingIds.increment();
        uint256 listingId = _listingIds.current();
        uint256 expirationTime = block.timestamp + (durationInDays * 1 days);

        idToBarterListing[listingId] = BarterListing(
            listingId,
            tokenId,
            msg.sender,
            expirationTime,
            true
        );

        emit BarterListingCreated(listingId, tokenId, msg.sender, expirationTime);
    }

    function makeBarterOffer(uint256 listingId, uint256 offeredTokenId) public {
        require(idToBarterListing[listingId].isActive, "Barter listing is not active");
        require(block.timestamp < idToBarterListing[listingId].expirationTime, "Barter listing has expired");
        require(ownerOf(offeredTokenId) == msg.sender, "Only the owner can offer the token for barter");

        listingIdToOffers[listingId].push(BarterOffer(offeredTokenId, msg.sender, false));

        emit BarterOfferMade(listingId, offeredTokenId, msg.sender);
    }

    function acceptBarterOffer(uint256 listingId, uint256 offeredTokenId) public {
        BarterListing storage listing = idToBarterListing[listingId];
        require(listing.isActive, "Barter listing is not active");
        require(block.timestamp < listing.expirationTime, "Barter listing has expired");
        require(listing.owner == msg.sender, "Only the listing owner can accept an offer");

        BarterOffer[] storage offers = listingIdToOffers[listingId];
        uint256 acceptedOfferIndex;
        bool offerFound = false;

        for (uint256 i = 0; i < offers.length; i++) {
            if (offers[i].offeredTokenId == offeredTokenId) {
                offers[i].isAccepted = true;
                acceptedOfferIndex = i;
                offerFound = true;
                break;
            }
        }

        require(offerFound, "Offer not found");

        address offerer = offers[acceptedOfferIndex].offerer;

        // Transfer the listed token to the offerer
        _transfer(listing.owner, offerer, listing.tokenId);

        // Transfer the offered token to the listing owner
        _transfer(offerer, listing.owner, offeredTokenId);

        // Close the listing
        listing.isActive = false;

        emit BarterOfferAccepted(listingId, offeredTokenId, offerer);
        emit BarterCompleted(listingId, listing.tokenId, offeredTokenId);
    }

    function cancelBarterListing(uint256 listingId) public {
        BarterListing storage listing = idToBarterListing[listingId];
        require(listing.isActive, "Barter listing is not active");
        require(listing.owner == msg.sender, "Only the listing owner can cancel the listing");

        listing.isActive = false;
    }

    function relistNFT(uint256 tokenId, uint256 durationInDays) public {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can relist the token");
        require(durationInDays > 0 && durationInDays <= 30, "Duration must be between 1 and 30 days");

        _listingIds.increment();
        uint256 listingId = _listingIds.current();
        uint256 expirationTime = block.timestamp + (durationInDays * 1 days);

        idToBarterListing[listingId] = BarterListing(
            listingId,
            tokenId,
            msg.sender,
            expirationTime,
            true
        );

        emit BarterListingCreated(listingId, tokenId, msg.sender, expirationTime);
    }

    function getBarterListing(uint256 listingId) public view returns (BarterListing memory) {
        return idToBarterListing[listingId];
    }

    function getBarterOffers(uint256 listingId) public view returns (BarterOffer[] memory) {
        return listingIdToOffers[listingId];
    }

    function fetchAllListings() public view returns (BarterListing[] memory) {
        uint totalListingCount = _listingIds.current();
        uint currentIndex = 0;
        BarterListing[] memory listings = new BarterListing[](totalListingCount);

        for (uint i = 1; i <= totalListingCount; i++) {
            BarterListing storage currentListing = idToBarterListing[i];
            listings[currentIndex] = currentListing;
            currentIndex++;
        }

        return listings;
    }

    function fetchMyListings() public view returns (BarterListing[] memory) {
        uint totalListingCount = _listingIds.current();
        uint myListingCount = 0;
        uint currentIndex = 0;

        for (uint i = 1; i <= totalListingCount; i++) {
            if (idToBarterListing[i].owner == msg.sender) {
                myListingCount++;
            }
        }

        BarterListing[] memory myListings = new BarterListing[](myListingCount);

        for (uint i = 1; i <= totalListingCount; i++) {
            if (idToBarterListing[i].owner == msg.sender) {
                BarterListing storage currentListing = idToBarterListing[i];
                myListings[currentIndex] = currentListing;
                currentIndex++;
            }
        }

        return myListings;
    }

    function fetchMyNFTs() public view returns (uint256[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 1; i <= totalItemCount; i++) {
            if (ownerOf(i) == msg.sender) {
                itemCount++;
            }
        }

        uint256[] memory items = new uint256[](itemCount);

        for (uint i = 1; i <= totalItemCount; i++) {
            if (ownerOf(i) == msg.sender) {
                items[currentIndex] = i;
                currentIndex++;
            }
        }

        return items;
    }
}

// contract NFTMarketplace is ERC721URIStorage {
//     using CounterLib for CounterLib.Counter;

//     CounterLib.Counter private _tokenIds;
//     CounterLib.Counter private _itemsSold;

//     uint256 public listingPrice = 0.0005 ether;
//     address payable public owner;

//     mapping(uint256 => MarketItem) private idMarketItem;
//     mapping(uint256 => BarterItem) private idBarterItem;

//     struct MarketItem {
//         uint256 tokenId;
//         address payable seller;
//         address payable owner;
//         uint256 price;
//         bool sold;
//     }

//     struct BarterItem {
//         uint256 tokenId;
//         address owner;
//         uint256 desiredTokenId;
//         bool available;
//     }

//     event MarketItemCreated(
//         uint256 indexed tokenId,
//         address seller,
//         address owner,
//         uint256 price,
//         bool sold
//     );

//     event BarterItemCreated(
//         uint256 indexed tokenId,
//         address owner,
//         uint256 desiredTokenId,
//         bool available
//     );

//     event BarterTradeCompleted(
//         uint256 indexed tokenId1,
//         address owner1,
//         uint256 indexed tokenId2,
//         address owner2
//     );

//     modifier onlyOwner() {
//         require(msg.sender == owner, "Only the owner can perform this operation");
//         _;
//     }

//     constructor() ERC721("NFT Metaverse Token", "MYNFT") {
//         owner = payable(msg.sender);
//     }

//     function updateListingPrice(uint256 _listingPrice) public onlyOwner {
//         listingPrice = _listingPrice;
//     }

//     function getListingPrice() public view returns (uint256) {
//         return listingPrice;
//     }

//     function createToken(string memory tokenURI, uint256 price) public payable returns (uint256) {
//         require(msg.value == listingPrice, "Price must equal listing price");
//         require(price > 0, "Price must be at least 1 wei");

//         _tokenIds.increment();
//         uint256 newTokenId = _tokenIds.current();

//         _mint(msg.sender, newTokenId);
//         _setTokenURI(newTokenId, tokenURI);

//         createMarketItem(newTokenId, price);

//         return newTokenId;
//     }

//     function createMarketItem(uint256 tokenId, uint256 price) private {
//         idMarketItem[tokenId] = MarketItem(
//             tokenId,
//             payable(msg.sender),
//             payable(address(this)),
//             price,
//             false
//         );

//         _transfer(msg.sender, address(this), tokenId);

//         emit MarketItemCreated(tokenId, msg.sender, address(this), price, false);
//     }

//     function resellToken(uint256 tokenId, uint256 price) public payable {
//         require(idMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");
//         require(msg.value == listingPrice, "Price must equal listing price");

//         idMarketItem[tokenId].sold = false;
//         idMarketItem[tokenId].price = price;
//         idMarketItem[tokenId].seller = payable(msg.sender);
//         idMarketItem[tokenId].owner = payable(address(this));

//         _itemsSold.decrement();

//         _transfer(msg.sender, address(this), tokenId);
//     }

//     function createMarketSale(uint256 tokenId) public payable {
//         uint256 price = idMarketItem[tokenId].price;
//         require(msg.value == price, "Please submit asking price in order to complete the purchase");

//         idMarketItem[tokenId].owner = payable(msg.sender);
//         idMarketItem[tokenId].sold = true;
//         idMarketItem[tokenId].seller = payable(address(0));
//         _itemsSold.increment();

//         _transfer(address(this), msg.sender, tokenId);
//         payable(owner).transfer(listingPrice);
//         payable(idMarketItem[tokenId].seller).transfer(msg.value);
//     }

//     function fetchMarketItems() public view returns (MarketItem[] memory) {
//         uint256 itemCount = _tokenIds.current();
//         uint256 unsoldItemCount = _tokenIds.current() - _itemsSold.current();
//         uint256 currentIndex = 0;

//         MarketItem[] memory items = new MarketItem[](unsoldItemCount);
//         for (uint256 i = 0; i < itemCount; i++) {
//             if (idMarketItem[i + 1].owner == address(this)) {
//                 uint256 currentId = i + 1;
//                 MarketItem storage currentItem = idMarketItem[currentId];
//                 items[currentIndex] = currentItem;
//                 currentIndex += 1;
//             }
//         }
//         return items;
//     }

//     function fetchMyNFTs() public view returns (MarketItem[] memory) {
//         uint256 totalItemCount = _tokenIds.current();
//         uint256 itemCount = 0;
//         uint256 currentIndex = 0;

//         for (uint256 i = 0; i < totalItemCount; i++) {
//             if (idMarketItem[i + 1].owner == msg.sender) {
//                 itemCount += 1;
//             }
//         }

//         MarketItem[] memory items = new MarketItem[](itemCount);
//         for (uint256 i = 0; i < totalItemCount; i++) {
//             if (idMarketItem[i + 1].owner == msg.sender) {
//                 uint256 currentId = i + 1;
//                 MarketItem storage currentItem = idMarketItem[currentId];
//                 items[currentIndex] = currentItem;
//                 currentIndex += 1;
//             }
//         }
//         return items;
//     }

//     function listForBarter(uint256 tokenId, uint256 desiredTokenId) public {
//         require(ownerOf(tokenId) == msg.sender, "Only the owner can list the token for barter");

//         idBarterItem[tokenId] = BarterItem(
//             tokenId,
//             msg.sender,
//             desiredTokenId,
//             true
//         );

//         emit BarterItemCreated(tokenId, msg.sender, desiredTokenId, true);
//     }

//     function acceptBarterTrade(uint256 offeredTokenId, uint256 desiredTokenId) public {
//         BarterItem memory barterItem = idBarterItem[desiredTokenId];
//         require(barterItem.available, "The desired token is not available for barter");
//         require(barterItem.desiredTokenId == offeredTokenId, "The offered token does not match the desired token");

//         address ownerOfOfferedToken = ownerOf(offeredTokenId);
//         address ownerOfDesiredToken = ownerOf(desiredTokenId);

//         require(ownerOfOfferedToken == msg.sender, "Only the owner of the offered token can accept the trade");

//         _transfer(ownerOfOfferedToken, barterItem.owner, offeredTokenId);
//         _transfer(barterItem.owner, ownerOfOfferedToken, desiredTokenId);

//         idBarterItem[desiredTokenId].available = false;

//         emit BarterTradeCompleted(offeredTokenId, ownerOfOfferedToken, desiredTokenId, barterItem.owner);
//     }

//     function fetchItemsListed() public view returns (MarketItem[] memory) {
//         uint256 totalItemCount = _tokenIds.current();
//         uint256 itemCount = 0;
//         uint256 currentIndex = 0;

//         for (uint256 i = 0; i < totalItemCount; i++) {
//             if (idMarketItem[i + 1].seller == msg.sender) {
//                 itemCount += 1;
//             }
//         }

//         MarketItem[] memory items = new MarketItem[](itemCount);
//         for (uint256 i = 0; i < totalItemCount; i++) {
//             if (idMarketItem[i + 1].seller == msg.sender) {
//                 uint256 currentId = i + 1;
//                 MarketItem storage currentItem = idMarketItem[currentId];
//                 items[currentIndex] = currentItem;
//                 currentIndex += 1;
//             }
//         }

//         return items;
//     }
// }