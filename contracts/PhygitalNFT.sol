// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PhygitalNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    constructor() ERC721("PhygitalNFT", "PNFT") {
        tokenCounter = 0;
    }

    function createNFT(string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        tokenCounter++;
        return newTokenId;
    }

    function transferNFT(address from, address to, uint256 tokenId) public {
        require(ownerOf(tokenId) == from, "You are not the owner of this NFT");
        _transfer(from, to, tokenId);
    }
}
