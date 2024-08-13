const web3 = require("../utils/web3");
const TradeContract = require("../build/contracts/TradeContract.json");

const contractAddress = "YOUR_CONTRACT_ADDRESS";
const contract = new web3.eth.Contract(TradeContract.abi, contractAddress);

exports.createTrade = async (req, res) => {
  const { item, counterparty } = req.body;
  const accounts = await web3.eth.getAccounts();

  try {
    await contract.methods
      .createTrade(item, counterparty)
      .send({ from: accounts[0] });
    res.status(201).json({ message: "Trade created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTrades = async (req, res) => {
  try {
    const trades = await contract.methods.getAllTrades().call();
    res.status(200).json(trades);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTrade = async (req, res) => {
  const { id, status } = req.body;
  const accounts = await web3.eth.getAccounts();

  try {
    await contract.methods.updateTrade(id, status).send({ from: accounts[0] });
    res.status(200).json({ message: "Trade updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
