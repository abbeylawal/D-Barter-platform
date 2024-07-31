// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTContract is ERC721, Ownable {
    uint public tokenCounter;

    struct NFT {
        uint tokenId;
        string description;
        string imageURL;
    }

    mapping(uint => NFT) public nfts;

    event NFTCreated(uint tokenId, string description, string imageURL);

    constructor() ERC721("NFTToken", "NFT") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function createNFT(string memory _description, string memory _imageURL) public onlyOwner returns (uint) {
        uint newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);
        nfts[newTokenId] = NFT(newTokenId, _description, _imageURL);
        tokenCounter++;
        emit NFTCreated(newTokenId, _description, _imageURL);
        return newTokenId;
    }

    function getNFT(uint _tokenId) public view returns (NFT memory) {
        return nfts[_tokenId];
    }
}
