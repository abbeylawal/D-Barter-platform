// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";
import "./Counter.sol";
import "./HTLC.sol";

contract NFTMarketplace is ERC721URIStorage {
    using CounterLib for CounterLib.Counter;

    CounterLib.Counter private _tokenIds;
    CounterLib.Counter private _listingIds;
    CounterLib.Counter private _offerIds;
    CounterLib.Counter private _transactionIds;

    address public contractOwner;
    HTLC public htlc;

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
        bool isAccepted;
    }

    enum TransactionStatus { Accepted, Completed, Cancelled } 

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

    mapping(uint256 => BarterListing) private idToBarterListing;
    mapping(uint256 => BarterOffer) private idToBarterOffer;
    mapping(uint256 => BarterTransaction) private idToBarterTransaction;
    mapping(address => uint256[]) private ownerToNFTs;
    mapping(uint256 => uint256) private offerToTokenId;

    event BarterListingCreated(uint256 indexed listingId, uint256 indexed tokenId, address itemOwner, uint256 expirationTime);
    event BarterOfferCreated(uint256 indexed offerId, uint256 indexed listingId, uint256 offerTokenId, address offerer);
    event HTLCSwapInitiated(bytes32 indexed swapId, uint256 indexed listingId, uint256 indexed offerId);
    event BarterOfferAccepted(uint256 indexed transactionId, uint256 indexed listingId, uint256 indexed offerId);
    event BarterTransactionCompleted(uint256 indexed transactionId);
    event BarterTransactionCancelled(uint256 indexed transactionId);

    constructor(address _htlcAddress) ERC721("Barter NFT", "BNFT") {
        contractOwner = msg.sender;
        htlc = HTLC(_htlcAddress);
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

    function fetchMyNFTs(address walletAddress) public view returns (uint256[] memory) {
        console.log("itemOwner walletAdderss: ",walletAddress );
        if (walletAddress == address(0)) {
            return ownerToNFTs[msg.sender];
        } else {
            return ownerToNFTs[walletAddress];
        }
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

    function fetchAvailableNFTsForBarter(address walletAddress) public view returns (uint256[] memory) {
        uint256[] memory ownedNFTs = fetchMyNFTs(walletAddress);
        uint256[] memory availableNFTs = new uint256[](ownedNFTs.length);
        uint256 availableCount = 0;

        for (uint256 i = 0; i < ownedNFTs.length; i++) {
            uint256 tokenId = ownedNFTs[i];
            bool isAvailable = true;

            // Check if the tokenId is involved in any active barter offer
            for (uint256 offerId = 1; offerId <= _offerIds.current(); offerId++) {
                if (idToBarterOffer[offerId].offerTokenId == tokenId && idToBarterOffer[offerId].isActive) {
                    isAvailable = false;
                    break;
                }
            }

            if (isAvailable) {
                availableNFTs[availableCount] = tokenId;
                availableCount++;
            }
        }

        // Resize the array to remove empty slots
        assembly {
            mstore(availableNFTs, availableCount)
        }

        return availableNFTs;
    }

    function fetchNFTByListingId(uint256 listingId) public view returns (BarterListing memory, string memory, address) {
        require(idToBarterListing[listingId].listingId == listingId, "Listing does not exist");

        BarterListing memory listing = idToBarterListing[listingId];
        require(listing.isActive, "Listing is not active");

        string memory tokenURI = tokenURI(listing.tokenId);
        address currentOwner = ownerOf(listing.tokenId);

        return (listing, tokenURI, currentOwner);
    }

    function fetchNFTByOfferId(uint256 offerId) public view returns (BarterOffer memory, string memory, address) {
        require(idToBarterOffer[offerId].offerId == offerId, "Offer does not exist");

        BarterOffer memory offer = idToBarterOffer[offerId];
        require(offer.isActive, "Offer is not active");

        string memory tokenURI = tokenURI(offer.offerTokenId);
        address currentOwner = ownerOf(offer.offerTokenId);

        return (offer, tokenURI, currentOwner);
    }

    // Function to create a barter offer for a specific listing
    function createBarterOffer(uint256 listingId) public returns (uint256) {
            require(idToBarterListing[listingId].isActive, "Listing is not active");

            // Generate new offerId
            _offerIds.increment();
            uint256 offerId = _offerIds.current();

            // Generate offerTokenId based on custom logic or current token count
            _tokenIds.increment();
            uint256 offerTokenId = _tokenIds.current();

            idToBarterOffer[offerId] = BarterOffer(
                offerId,
                listingId,
                offerTokenId,
                msg.sender,
                true,
                false  // Offer is not accepted initially
            );

            offerToTokenId[offerId] = offerTokenId;

            emit BarterOfferCreated(offerId, listingId, offerTokenId, msg.sender);

            return offerId;
    }


    function getBarterListing(uint256 listingId) public view returns (BarterListing memory) {
        return idToBarterListing[listingId];
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
    
    // ------HTLC--------

    function initiateHTLCSwap(uint256 listingId, uint256 offerId, bytes32 _hashlock, uint256 _timelock) public {
        require(idToBarterListing[listingId].isActive, "Listing is not active");
        require(idToBarterOffer[offerId].isActive, "Offer is not active");
        require(idToBarterOffer[offerId].listingId == listingId, "Offer does not match listing");
        require(_timelock > block.timestamp, "Timelock must be in the future");

        BarterListing memory listing = idToBarterListing[listingId];
        BarterOffer memory offer = idToBarterOffer[offerId];

        require(msg.sender == listing.itemOwner, "Only listing owner can initiate swap");

        // Approve HTLC contract to transfer the NFT
        approve(address(htlc), listing.tokenId); 

        bytes32 swapId = keccak256(abi.encodePacked(
            msg.sender,
            offer.offerer,
            address(this),
            address(this),
            listing.tokenId,
            offer.offerTokenId,
            _hashlock,
            _timelock
        ));

        htlc.initiateSwap(
            offer.offerer,
            address(this),
            address(this),
            listing.tokenId,
            offer.offerTokenId,
            _hashlock,
            _timelock
        );

        idToBarterListing[listingId].isActive = false;
        idToBarterOffer[offerId].isActive = false;

        emit HTLCSwapInitiated(swapId, listingId, offerId);
    }

}
    // function participantDepositForSwap(bytes32 swapId) public {
    //     // Retrieve the swap information from the HTLC contract
    //     HTLC.Swap memory swap = htlc.swaps(swapId);

    //     // Ensure the participant matches the one recorded in the swap
    //     require(msg.sender == swap.participant, "Only participant can deposit");

    //     // Approve the HTLC contract to transfer the participant's NFT
    //     approve(address(htlc), swap.participantTokenId);

    //     // Execute the participant's deposit through the HTLC contract
    //     htlc.participantDeposit(swapId);
    // }