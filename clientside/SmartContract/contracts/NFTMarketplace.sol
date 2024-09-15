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
        uint256 mintTime;
        uint256 expirationTime;
        bool isActive;
        bool isOffered;
    }

    struct BarterOffer {
        uint256 offerId;
        uint256 listingId;
        uint256 offerTokenId;
        address offerer;
        bool isActive;
        bool isAccepted;
        uint256 expirationTime;
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

    struct BarterOfferDetails {
        uint256 offeredTokenId;
        address offerer;
        bool isAccepted;
        string tokenURI;
        uint256 expirationTime;
    }

    mapping(uint256 => BarterListing) private idToBarterListing;
    mapping(uint256 => BarterOffer) private idToBarterOffer;
    mapping(uint256 => BarterTransaction) private idToBarterTransaction;
    mapping(address => uint256[]) private ownerToNFTs;
    mapping(uint256 => uint256) private offerToTokenId;
    mapping(uint256 => uint256[]) private listingToOffers;
    mapping(uint256 => bool) private tokenInActiveOffer;

    event BarterListingCreated(uint256 indexed listingId, uint256 indexed tokenId, address itemOwner, uint256 expirationTime);
    event BarterOfferCreated(uint256 indexed offerId, uint256 indexed listingId, uint256 offerTokenId, address offerer, uint256 expirationTime);
    event HTLCSwapInitiated(bytes32 indexed swapId, uint256 indexed listingId, uint256 indexed offerId);
    event BarterOfferAccepted(uint256 indexed transactionId, uint256 indexed listingId, uint256 indexed offerId);    
    event BarterOfferDeclined(uint256 indexed listingId, uint256 indexed offerId);
    event BarterTransactionCompleted(uint256 indexed transactionId);
    event BarterTransactionCancelled(uint256 indexed transactionId);
    event BarterOfferExpired(uint256 indexed listingId, uint256 indexed offerId);

    constructor(address _htlcAddress) ERC721("Barter NFT", "BNFT") {
        contractOwner = msg.sender;
        htlc = HTLC(_htlcAddress);
    }

    function createTokenAndList(string memory tokenURI) public returns (uint256, uint256) {
        // uint256 defaultDurationInDays = 3600;

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        ownerToNFTs[msg.sender].push(newTokenId);

        _listingIds.increment();
        uint256 listingId = _listingIds.current();
        uint256 expirationTime = 0;
        uint256 mintTime = block.timestamp;

        idToBarterListing[listingId] = BarterListing(
            listingId,
            newTokenId,
            msg.sender,
            mintTime,
            expirationTime,
            true,
            false
        );

        emit BarterListingCreated(listingId, newTokenId, msg.sender, mintTime);

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


    function fetchNFTByListingId(uint256 listingId) public view returns (BarterListing memory, string memory, address) {
        require(idToBarterListing[listingId].listingId == listingId, "Listing does not exist");

        BarterListing memory listing = idToBarterListing[listingId];
        require(listing.isActive, "Listing is not active");

        string memory tokenURI = tokenURI(listing.tokenId);
        address currentOwner = ownerOf(listing.tokenId);

        return (listing, tokenURI, currentOwner);
    }


    function fetchNFTByOfferId(uint256 offerId)
        public 
        view 
        returns (
            BarterOffer memory offer, 
            string memory fetchedTokenURI, 
            address currentOwner, 
            address itemOwner
        ) 
    {
        // Fetch the offer from storage
        offer = idToBarterOffer[offerId];
        
        // Check that the offer exists by verifying the offerId
        require(offer.offerId == offerId, "Offer does not exist");
        
        // Check that the offer is active
        require(offer.isActive, "Offer is not active");
        require(offer.offerer == msg.sender, "You didnt make this offer");

        // Check that the offer has not expired
        require(block.timestamp < offer.expirationTime, "Offer has expired");

        // Fetch the token URI for the offer token
        fetchedTokenURI = tokenURI(offer.offerTokenId);
        
        // Fetch the current owner of the offer token
        currentOwner = ownerOf(offer.offerTokenId);

        // Fetch the itemOwner of the offer
        itemOwner = offer.offerer;

        return (offer, fetchedTokenURI, currentOwner, itemOwner);
    }


    // Function to create a barter offer for a specific listing
    function createBarterOffer(uint256 listingId, uint256 offerTokenId, uint256 durationInHours) public returns (uint256) {
        // Ensure the listing is active
        require(idToBarterListing[listingId].isActive, "Listing is not active");
        require(ownerOf(offerTokenId) == msg.sender, "You don't own this token");
        
        // Ensure the token isn't already part of an active offer
        require(!tokenInActiveOffer[offerTokenId], "This token is already in an active offer");

        if (durationInHours == 0) {
            durationInHours = 24;
        }

        uint256 expirationTime = block.timestamp + (durationInHours * 1 hours);

        // Generate new offerId
        _offerIds.increment();
        uint256 offerId = _offerIds.current();

        // Transfer the offer token to the contract for escrow
        transferFrom(msg.sender, address(this), offerTokenId);

        // Create the BarterOffer struct
        idToBarterOffer[offerId] = BarterOffer(
            offerId,
            listingId,
            offerTokenId,
            msg.sender,
            true,
            false,
            expirationTime
        );

        offerToTokenId[offerId] = offerTokenId;
        listingToOffers[listingId].push(offerId);
        tokenInActiveOffer[offerTokenId] = true;

        // Update the BarterListing to indicate it has an active offer
        idToBarterListing[listingId].isOffered = true;

        // Emit the BarterOfferCreated event
        emit BarterOfferCreated(offerId, listingId, offerTokenId, msg.sender, expirationTime);

        return offerId;
    }


    function getBarterOfferByListingId(uint256 listingId) public view returns (BarterOffer memory) {
    // Find the active offer associated with the listingId
    for (uint i = 0; i < listingToOffers[listingId].length; i++) {
        uint256 offerId = listingToOffers[listingId][i];
        BarterOffer memory offer = idToBarterOffer[offerId];

        // Return the first active offer found
        if (offer.isActive) {
            return offer;
        }
    }

    // If no active offer is found, revert with a meaningful error
    revert("No active offer found for the given listing");
}

function fetchActiveOffersByAddress(address walletAddress) public view returns (BarterOffer[] memory) {
    require(walletAddress != address(0), "Invalid wallet address");
    uint256 totalOffersCount = _offerIds.current();
    uint256 activeOffersCount = 0;

    // First loop: Count the number of active offers by the given wallet address
    for (uint256 i = 1; i <= totalOffersCount; i++) {
        if (idToBarterOffer[i].offerer == walletAddress && idToBarterOffer[i].isActive) {
            activeOffersCount++;
        }
    }

    // Always return an array, even if it's empty
    BarterOffer[] memory activeOffers = new BarterOffer[](activeOffersCount);
    
    if (activeOffersCount > 0) {
        uint256 currentIndex = 0;
        // Second loop: Collect all active offers by the given wallet address
        for (uint256 i = 1; i <= totalOffersCount; i++) {
            if (idToBarterOffer[i].offerer == walletAddress && idToBarterOffer[i].isActive) {
                activeOffers[currentIndex] = idToBarterOffer[i];
                currentIndex++;
            }
        }
    }

    return activeOffers;
}

    function getBarterOffers(uint256 listingId) public view returns (BarterOfferDetails[] memory) {
        uint256[] memory offerIds = listingToOffers[listingId];
        BarterOfferDetails[] memory offerDetails = new BarterOfferDetails[](offerIds.length);

        for (uint i = 0; i < offerIds.length; i++) {
            BarterOffer storage offer = idToBarterOffer[offerIds[i]];
            string memory uri = tokenURI(offer.offerTokenId);

            offerDetails[i] = BarterOfferDetails({
                offeredTokenId: offer.offerTokenId,
                offerer: offer.offerer,
                isAccepted: offer.isAccepted,
                tokenURI: uri,
                expirationTime: offer.expirationTime
            });
        }

        return offerDetails;
    }


    function acceptBarterOffer(uint256 listingId, uint256 offerId) public {
        require(idToBarterListing[listingId].itemOwner == msg.sender, "You are not the owner of this listing");
        require(idToBarterOffer[offerId].listingId == listingId, "Offer does not match listing");
        require(idToBarterOffer[offerId].isActive, "Offer is not active");
        require(block.timestamp < idToBarterOffer[offerId].expirationTime, "Offer has expired");

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

        //----- Transfer NFTs
        _transfer(listing.itemOwner, offer.offerer, listing.tokenId);
        _transfer(offer.offerer, listing.itemOwner, offer.offerTokenId);

        // Update listings and offers
        listing.isActive = false;
        offer.isActive = false;
        offer.isAccepted = true;
        tokenInActiveOffer[offer.offerTokenId] = false;

        // Deactivate all other offers for this listing
        for (uint i = 0; i < listingToOffers[listingId].length; i++) {
            uint256 currentOfferId = listingToOffers[listingId][i];
            if (currentOfferId != offerId && idToBarterOffer[currentOfferId].isActive) {
                idToBarterOffer[currentOfferId].isActive = false;
                tokenInActiveOffer[idToBarterOffer[currentOfferId].offerTokenId] = false;
            }
        }
        // -------

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


    function declineBarterOffer(uint256 listingId, uint256 offerId) public {
        require(idToBarterListing[listingId].itemOwner == msg.sender, "You are not the owner of this listing");
        require(idToBarterOffer[offerId].listingId == listingId, "Offer does not match listing");
        require(idToBarterOffer[offerId].isActive, "Offer is not active");

        // Mark the offer as inactive
        idToBarterOffer[offerId].isActive = false;
        tokenInActiveOffer[idToBarterOffer[offerId].offerTokenId] = false;

        // Return the offered token to the offerer
        _transfer(address(this), idToBarterOffer[offerId].offerer, idToBarterOffer[offerId].offerTokenId);

        emit BarterOfferDeclined(listingId, offerId);
    }

    function cancelBarterTransaction(uint256 transactionId) public {
        BarterTransaction storage transaction = idToBarterTransaction[transactionId];
        require(transaction.status == TransactionStatus.Accepted, "Transaction is not in Accepted state");
        require(msg.sender == transaction.lister || msg.sender == transaction.offerer, "You are not part of this transaction");

        // Update the status to Cancelled
        transaction.status = TransactionStatus.Cancelled;
        idToBarterListing[transaction.listingId].isActive = true;
        idToBarterOffer[transaction.offerId].isActive = true;

        // Return NFTs to their respective owners
        _transfer(address(this), transaction.lister, transaction.listerTokenId);
        _transfer(address(this), transaction.offerer, transaction.offererTokenId);

        emit BarterTransactionCancelled(transactionId);
    }

    function handleExpiredOffers(uint256 listingId) public {
        for (uint i = 0; i < listingToOffers[listingId].length; i++) {
            uint256 offerId = listingToOffers[listingId][i];
            BarterOffer storage offer = idToBarterOffer[offerId];

            // Check if the offer is active and has expired
            if (offer.isActive && block.timestamp > offer.expirationTime) {
                // Mark the offer as inactive
                offer.isActive = false;
                tokenInActiveOffer[offer.offerTokenId] = false;

                // Return the offered token to the offerer
                _transfer(address(this), offer.offerer, offer.offerTokenId);

                emit BarterOfferExpired(listingId, offerId);
            }
        }
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
