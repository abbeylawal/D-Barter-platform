// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Security {
    address private _owner;
    bool private paused;
    bool private locked;
    mapping(address => bool) public whitelist;
    uint256 public maxTransactionLimit;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event Paused(address account);
    event Unpaused(address account);
    event WhitelistUpdated(address indexed account, bool status);
    event MaxTransactionLimitUpdated(uint256 newLimit);

    constructor(address initialOwner, uint256 _maxTransactionLimit) {
        _owner = initialOwner;
        maxTransactionLimit = _maxTransactionLimit;
        paused = false;
        emit OwnershipTransferred(address(0), initialOwner);
    }

    modifier onlyOwner() {
        require(_owner == msg.sender, "Caller is not the owner");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

    modifier whenNotPaused() {
        require(!paused, "Pausable: paused");
        _;
    }

    modifier whenPaused() {
        require(paused, "Pausable: not paused");
        _;
    }

    function pause() external onlyOwner whenNotPaused {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyOwner whenPaused {
        paused = false;
        emit Unpaused(msg.sender);
    }

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "Caller is not whitelisted");
        _;
    }

    modifier withinTransactionLimit(uint256 _value) {
        require(_value <= maxTransactionLimit, "Transaction value exceeds limit");
        _;
    }

    modifier nonReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    function addToWhitelist(address _account) external onlyOwner {
        whitelist[_account] = true;
        emit WhitelistUpdated(_account, true);
    }

    function removeFromWhitelist(address _account) external onlyOwner {
        whitelist[_account] = false;
        emit WhitelistUpdated(_account, false);
    }

    function setMaxTransactionLimit(uint256 _newLimit) external onlyOwner {
        maxTransactionLimit = _newLimit;
        emit MaxTransactionLimitUpdated(_newLimit);
    }

    function owner() public view returns (address) {
        return _owner;
    }
}
