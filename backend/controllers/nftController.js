const NFT = require("../models/NFT");
const User = require("../models/User");
const web3 = require("../utils/web3");
const NFTContract = require("../build/contracts/NFTContract.json");

const contractAddress = "YOUR_CONTRACT_ADDRESS";
const contract = new web3.eth.Contract(NFTContract.abi, contractAddress);

exports.createNFT = async (req, res) => {
  const { description, imageURL } = req.body;
  const accounts = await web3.eth.getAccounts();

  try {
    const result = await contract.methods
      .createNFT(description, imageURL)
      .send({ from: accounts[0] });
    const tokenId = result.events.NFTCreated.returnValues.tokenId;

    const newNFT = new NFT({
      tokenId,
      description,
      imageURL,
      owner: req.user,
    });

    await newNFT.save();

    const user = await User.findById(req.user);
    user.nfts.push(newNFT);
    await user.save();

    res.status(201).json(newNFT);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getNFTs = async (req, res) => {
  try {
    const nfts = await NFT.find();
    res.status(200).json(nfts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
