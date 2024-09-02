// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Importing OpenZeppelin libraries
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

// ==========================================
contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    uint256 public listingPrice = 0.0005 ether;
    address payable public owner;

    mapping(uint256 => MarketItem) private idMarketItem;
    mapping(uint256 => BarterItem) private idBarterItem;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    struct BarterItem {
        uint256 tokenId;
        address owner;
        uint256 desiredTokenId;
        bool available;
    }

    event MarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    event BarterItemCreated(
        uint256 indexed tokenId,
        address owner,
        uint256 desiredTokenId,
        bool available
    );

    event BarterTradeCompleted(
        uint256 indexed tokenId1,
        address owner1,
        uint256 indexed tokenId2,
        address owner2
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this operation");
        _;
    }

    constructor() ERC721("NFT Metaverse Token", "MYNFT") {
        owner = payable(msg.sender);
    }

    function updateListingPrice(uint256 _listingPrice) public onlyOwner {
        listingPrice = _listingPrice;
    }

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function createToken(string memory tokenURI, uint256 price) public payable returns (uint256) {
        require(msg.value == listingPrice, "Price must equal listing price");
        require(price > 0, "Price must be at least 1 wei");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        createMarketItem(newTokenId, price);

        return newTokenId;
    }

    function createMarketItem(uint256 tokenId, uint256 price) private {
        idMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId);

        emit MarketItemCreated(tokenId, msg.sender, address(this), price, false);
    
    }


    // ========== Function FOR RESALE TOKEN ======== 


    function resellToken(uint256 tokenId, uint256 price) public payable {
        require(idMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");
        require(msg.value == listingPrice, "Price must equal listing price");

        idMarketItem[tokenId].sold = false;
        idMarketItem[tokenId].price = price;
        idMarketItem[tokenId].seller = payable(msg.sender);
        idMarketItem[tokenId].owner = payable(address(this));
        _itemsSold.decrement();

        _transfer(msg.sender, address(this), tokenId);
    }

    function createMarketSale(uint256 tokenId) public payable {
        uint256 price = idMarketItem[tokenId].price;
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");

        idMarketItem[tokenId].owner = payable(msg.sender);
        idMarketItem[tokenId].sold = true;
        idMarketItem[tokenId].seller = payable(address(0));
        _itemsSold.increment();

        _transfer(address(this), msg.sender, tokenId);
        payable(owner).transfer(listingPrice);
        payable(idMarketItem[tokenId].seller).transfer(msg.value);
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _tokenIds.current();
        uint256 unsoldItemCount = _tokenIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idMarketItem[i + 1].owner == address(this)) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // List an NFT for barter
    function listForBarter(uint256 tokenId, uint256 desiredTokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can list the token for barter");

        idBarterItem[tokenId] = BarterItem(
            tokenId,
            msg.sender,
            desiredTokenId,
            true
        );

        emit BarterItemCreated(tokenId, msg.sender, desiredTokenId, true);
    }

    // Accept a barter trade
    function acceptBarterTrade(uint256 offeredTokenId, uint256 desiredTokenId) public {
        BarterItem memory barterItem = idBarterItem[desiredTokenId];
        require(barterItem.available, "The desired token is not available for barter");
        require(barterItem.desiredTokenId == offeredTokenId, "The offered token does not match the desired token");

        address ownerOfOfferedToken = ownerOf(offeredTokenId);
        address ownerOfDesiredToken = ownerOf(desiredTokenId);

        require(ownerOfOfferedToken == msg.sender, "Only the owner of the offered token can accept the trade");

        _transfer(ownerOfOfferedToken, barterItem.owner, offeredTokenId);
        _transfer(barterItem.owner, ownerOfOfferedToken, desiredTokenId);

        idBarterItem[desiredTokenId].available = false;

        emit BarterTradeCompleted(offeredTokenId, ownerOfOfferedToken, desiredTokenId, barterItem.owner);
    }
}