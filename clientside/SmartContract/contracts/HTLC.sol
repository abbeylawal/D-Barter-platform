// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract HTLC {
    struct Swap {
        address initiator;
        address participant;
        address initiatorTokenContract;
        address participantTokenContract;
        uint256 initiatorTokenId;
        uint256 participantTokenId;
        bytes32 hashlock;
        uint256 timelock;
        bool isActive;
        bool isCompleted;
    }

    mapping(bytes32 => Swap) public swaps;

    event SwapInitiated(bytes32 indexed swapId, address indexed initiator, address indexed participant);
    event SwapCompleted(bytes32 indexed swapId);
    event SwapCancelled(bytes32 indexed swapId);

    function initiateSwap(
        address _participant,
        address _initiatorTokenContract,
        address _participantTokenContract,
        uint256 _initiatorTokenId,
        uint256 _participantTokenId,
        bytes32 _hashlock,
        uint256 _timelock
    ) external {
        require(_timelock > block.timestamp, "Timelock must be in the future");

        bytes32 swapId = keccak256(abi.encodePacked(
            msg.sender, 
            _participant, 
            _initiatorTokenContract, 
            _participantTokenContract, 
            _initiatorTokenId, 
            _participantTokenId, 
            _hashlock, 
            _timelock
        ));
        require(!swaps[swapId].isActive, "Swap already exists");

        IERC721(_initiatorTokenContract).transferFrom(msg.sender, address(this), _initiatorTokenId);

        swaps[swapId] = Swap({
            initiator: msg.sender,
            participant: _participant,
            initiatorTokenContract: _initiatorTokenContract,
            participantTokenContract: _participantTokenContract,
            initiatorTokenId: _initiatorTokenId,
            participantTokenId: _participantTokenId,
            hashlock: _hashlock,
            timelock: _timelock,
            isActive: true,
            isCompleted: false
        });

        emit SwapInitiated(swapId, msg.sender, _participant);
    }

    function participantDeposit(bytes32 _swapId) external {
        Swap storage swap = swaps[_swapId];
        require(swap.isActive, "Swap is not active");
        require(!swap.isCompleted, "Swap is already completed");
        require(msg.sender == swap.participant, "Only participant can deposit");

        IERC721(swap.participantTokenContract).transferFrom(msg.sender, address(this), swap.participantTokenId);
    }

    function completeSwap(bytes32 _swapId, bytes32 _preimage) external {
        Swap storage swap = swaps[_swapId];
        require(swap.isActive, "Swap is not active");
        require(!swap.isCompleted, "Swap is already completed");
        require(block.timestamp < swap.timelock, "Swap has expired");
        require(keccak256(abi.encodePacked(_preimage)) == swap.hashlock, "Invalid preimage");

        swap.isCompleted = true;
        swap.isActive = false;

        IERC721(swap.initiatorTokenContract).transferFrom(address(this), swap.participant, swap.initiatorTokenId);
        IERC721(swap.participantTokenContract).transferFrom(address(this), swap.initiator, swap.participantTokenId);

        emit SwapCompleted(_swapId);
    }

    function cancelSwap(bytes32 _swapId) external {
        Swap storage swap = swaps[_swapId];
        require(swap.isActive, "Swap is not active");
        require(!swap.isCompleted, "Swap is already completed");
        require(block.timestamp >= swap.timelock, "Timelock has not expired");

        swap.isActive = false;

        IERC721(swap.initiatorTokenContract).transferFrom(address(this), swap.initiator, swap.initiatorTokenId);
        
        if (IERC721(swap.participantTokenContract).ownerOf(swap.participantTokenId) == address(this)) {
            IERC721(swap.participantTokenContract).transferFrom(address(this), swap.participant, swap.participantTokenId);
        }

        emit SwapCancelled(_swapId);
    }
}