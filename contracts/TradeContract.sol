// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TradeContract {
    struct Trade {
        uint id;
        string item;
        address owner;
        address counterparty;
        string status;
    }

    uint public tradeCounter;
    mapping(uint => Trade) public trades;

    event TradeCreated(uint id, string item, address owner, address counterparty, string status);
    event TradeUpdated(uint id, string status);

    function createTrade(string memory _item, address _counterparty) public {
        tradeCounter++;
        trades[tradeCounter] = Trade(tradeCounter, _item, msg.sender, _counterparty, "initiated");
        emit TradeCreated(tradeCounter, _item, msg.sender, _counterparty, "initiated");
    }

    function updateTrade(uint _id, string memory _status) public {
        Trade storage trade = trades[_id];
        require(msg.sender == trade.owner || msg.sender == trade.counterparty, "Only participants can update the trade");
        trade.status = _status;
        emit TradeUpdated(_id, _status);
    }

    function getTrade(uint _id) public view returns (Trade memory) {
        return trades[_id];
    }

    function getAllTrades() public view returns (Trade[] memory) {
        Trade[] memory tradeList = new Trade[](tradeCounter);
        for (uint i = 1; i <= tradeCounter; i++) {
            tradeList[i - 1] = trades[i];
        }
        return tradeList;
    }
}
