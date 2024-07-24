// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HTLC {
    struct Agreement {
        address payable sender;
        address payable receiver;
        uint256 amount;
        bytes32 hashlock;
        uint256 timelock;
        bool withdrawn;
        bool refunded;
        bytes32 preimage;
    }

    mapping(bytes32 => Agreement) public agreements;

    function newAgreement(
        bytes32 _contractId,
        address payable _receiver,
        uint256 _amount,
        bytes32 _hashlock,
        uint256 _timelock
    ) external payable {
        require(agreements[_contractId].sender == address(0), "Contract ID already exists");

        agreements[_contractId] = Agreement(
            payable(msg.sender),
            _receiver,
            _amount,
            _hashlock,
            block.timestamp + _timelock,
            false,
            false,
            0x0
        );
    }

    function withdraw(bytes32 _contractId, bytes32 _preimage) external {
        Agreement storage agreement = agreements[_contractId];

        require(agreement.receiver == msg.sender, "Only the receiver can withdraw");
        require(agreement.withdrawn == false, "Amount already withdrawn");
        require(keccak256(abi.encodePacked(_preimage)) == agreement.hashlock, "Invalid preimage");

        agreement.preimage = _preimage;
        agreement.withdrawn = true;
        agreement.receiver.transfer(agreement.amount);
    }

    function refund(bytes32 _contractId) external {
        Agreement storage agreement = agreements[_contractId];

        require(agreement.sender == msg.sender, "Only the sender can refund");
        require(agreement.refunded == false, "Amount already refunded");
        require(block.timestamp >= agreement.timelock, "Timelock has not expired");

        agreement.refunded = true;
        agreement.sender.transfer(agreement.amount);
    }
}
