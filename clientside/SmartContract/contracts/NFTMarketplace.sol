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
    CounterLib.Counter private _offerIds;
    CounterLib.Counter private _transactionIds;

    address public contractOwner;

    struct BarterListing {
        uint256 listingId;
        uint256 tokenId;
        address itemOwner;
        uint256 expirationTime;
        bool isActive;
    }

    struct BarterOffer {
        uint256 offerId;
        uint256 listingId;
        uint256 offerTokenId;
        address offerer;
        bool isActive;
    }

    struct BarterTransaction {
        uint256 transactionId;
        uint256 listingId;
        uint256 offerId;
        address lister;
        address offerer;
        uint256 listerTokenId;
        uint256 offererTokenId;
        uint256 timestamp;
        TransactionStatus status;
    }

    enum TransactionStatus { Pending, Accepted, Completed, Cancelled }

    mapping(uint256 => BarterListing) private idToBarterListing;
    mapping(uint256 => BarterOffer) private idToBarterOffer;
    mapping(uint256 => BarterTransaction) private idToBarterTransaction;
    mapping(address => uint256[]) private ownerToNFTs;

    event BarterListingCreated(uint256 indexed listingId, uint256 indexed tokenId, address itemOwner, uint256 expirationTime);
    event BarterOfferCreated(uint256 indexed offerId, uint256 indexed listingId, uint256 offerTokenId, address offerer);
    event BarterOfferAccepted(uint256 indexed transactionId, uint256 indexed listingId, uint256 indexed offerId);
    event BarterTransactionCompleted(uint256 indexed transactionId);
    event BarterTransactionCancelled(uint256 indexed transactionId);

    constructor() ERC721("Barter NFT", "BNFT") {
        contractOwner = msg.sender;
    }

    function createTokenAndList(string memory tokenURI) public returns (uint256, uint256) {
        uint256 defaultDurationInDays = 7;

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        ownerToNFTs[msg.sender].push(newTokenId);

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

    function fetchMyNFTs() public view returns (uint256[] memory) {
        return ownerToNFTs[msg.sender];
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
            console.log("Fetching listing: ", i);
            console.log("Listing active status: ", currentListing.isActive);

            // Only include active listings
            if (currentListing.isActive) {
                listings[currentIndex] = currentListing;
                currentIndex++;
            }
        }

        // Resize the array to remove empty slots
        assembly {
            mstore(listings, currentIndex)
        }

        console.log("Number of active listings returned: ", currentIndex);
        return listings;
    }

    function createBarterOffer(uint256 listingId, uint256 offerTokenId) public {
        require(ownerOf(offerTokenId) == msg.sender, "You don't own this token");
        require(idToBarterListing[listingId].isActive, "Listing is not active");

        _offerIds.increment();
        uint256 offerId = _offerIds.current();

        idToBarterOffer[offerId] = BarterOffer(
            offerId,
            listingId,
            offerTokenId,
            msg.sender,
            true
        );

        emit BarterOfferCreated(offerId, listingId, offerTokenId, msg.sender);
    }

    function acceptBarterOffer(uint256 listingId, uint256 offerId) public {
        require(idToBarterListing[listingId].itemOwner == msg.sender, "You are not the owner of this listing");
        require(idToBarterOffer[offerId].listingId == listingId, "Offer does not match listing");
        require(idToBarterOffer[offerId].isActive, "Offer is not active");

        BarterListing memory listing = idToBarterListing[listingId];
        BarterOffer memory offer = idToBarterOffer[offerId];

        _transactionIds.increment();
        uint256 transactionId = _transactionIds.current();

        idToBarterTransaction[transactionId] = BarterTransaction(
            transactionId,
            listingId,
            offerId,
            listing.itemOwner,
            offer.offerer,
            listing.tokenId,
            offer.offerTokenId,
            block.timestamp,
            TransactionStatus.Accepted
        );

        idToBarterListing[listingId].isActive = false;
        idToBarterOffer[offerId].isActive = false;

        emit BarterOfferAccepted(transactionId, listingId, offerId);
    }

    function confirmBarterTransaction(uint256 transactionId) public {
        BarterTransaction storage transaction = idToBarterTransaction[transactionId];
        require(transaction.status == TransactionStatus.Accepted, "Transaction is not in Accepted state");
        require(msg.sender == transaction.lister || msg.sender == transaction.offerer, "You are not part of this transaction");

        if (msg.sender == transaction.lister) {
            require(ownerOf(transaction.listerTokenId) == msg.sender, "You don't own the listed token anymore");
            _transfer(msg.sender, transaction.offerer, transaction.listerTokenId);
        } else {
            require(ownerOf(transaction.offererTokenId) == msg.sender, "You don't own the offered token anymore");
            _transfer(msg.sender, transaction.lister, transaction.offererTokenId);
        }

        if (ownerOf(transaction.listerTokenId) == transaction.offerer && ownerOf(transaction.offererTokenId) == transaction.lister) {
            transaction.status = TransactionStatus.Completed;
            emit BarterTransactionCompleted(transactionId);
        }
    }

    function cancelBarterTransaction(uint256 transactionId) public {
        BarterTransaction storage transaction = idToBarterTransaction[transactionId];
        require(transaction.status == TransactionStatus.Accepted, "Transaction is not in Accepted state");
        require(msg.sender == transaction.lister || msg.sender == transaction.offerer, "You are not part of this transaction");

        transaction.status = TransactionStatus.Cancelled;
        idToBarterListing[transaction.listingId].isActive = true;
        idToBarterOffer[transaction.offerId].isActive = true;

        emit BarterTransactionCancelled(transactionId);
    }

    function fetchMyTransactions() public view returns (BarterTransaction[] memory) {
        uint totalTransactionCount = _transactionIds.current();
        uint currentIndex = 0;

        BarterTransaction[] memory transactions = new BarterTransaction[](totalTransactionCount);

        for (uint i = 1; i <= totalTransactionCount; i++) {
            BarterTransaction storage currentTransaction = idToBarterTransaction[i];
            if (currentTransaction.lister == msg.sender || currentTransaction.offerer == msg.sender) {
                transactions[currentIndex] = currentTransaction;
                currentIndex++;
            }
        }

        assembly {
            mstore(transactions, currentIndex)
        }

        return transactions;
    }
}