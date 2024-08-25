// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract HTLC {
    struct Swap {
        address initiator;
        address participant;
        address tokenContract;
        uint256 tokenId;
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
        address _tokenContract,
        uint256 _tokenId,
        bytes32 _hashlock,
        uint256 _timelock
    ) external {
        require(_timelock > block.timestamp, "Timelock must be in the future");

        bytes32 swapId = keccak256(abi.encodePacked(msg.sender, _participant, _tokenContract, _tokenId, _hashlock, _timelock));
        require(!swaps[swapId].isActive, "Swap already exists");

        IERC721(_tokenContract).transferFrom(msg.sender, address(this), _tokenId);

        swaps[swapId] = Swap({
            initiator: msg.sender,
            participant: _participant,
            tokenContract: _tokenContract,
            tokenId: _tokenId,
            hashlock: _hashlock,
            timelock: _timelock,
            isActive: true,
            isCompleted: false
        });

        emit SwapInitiated(swapId, msg.sender, _participant);
    }

    function completeSwap(bytes32 _swapId, bytes32 _preimage) external {
        Swap storage swap = swaps[_swapId];
        require(swap.isActive, "Swap is not active");
        require(!swap.isCompleted, "Swap is already completed");
        require(block.timestamp < swap.timelock, "Swap has expired");
        require(keccak256(abi.encodePacked(_preimage)) == swap.hashlock, "Invalid preimage");

        swap.isCompleted = true;
        swap.isActive = false;

        IERC721(swap.tokenContract).transferFrom(address(this), swap.participant, swap.tokenId);

        emit SwapCompleted(_swapId);
    }

    function cancelSwap(bytes32 _swapId) external {
        Swap storage swap = swaps[_swapId];
        require(swap.isActive, "Swap is not active");
        require(!swap.isCompleted, "Swap is already completed");
        require(block.timestamp >= swap.timelock, "Timelock has not expired");

        swap.isActive = false;

        IERC721(swap.tokenContract).transferFrom(address(this), swap.initiator, swap.tokenId);

        emit SwapCancelled(_swapId);
    }
}