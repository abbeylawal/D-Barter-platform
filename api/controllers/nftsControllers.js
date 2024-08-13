const fs = require("fs");

const nfts = JSON.parse(
  fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`)
);

exports.checkId = (req, res, next, value) => {
    if(req.params.id * 1 > nfts.length){
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID",
        });
    }
    next();
};


exports.checkBody = (req, res, next)=> {
  if(!req.body.name || !req.body.price){
    return res.status(400).json({
      status: 'fail',
      message: "Missing name and price",
    });
  }
  next();
};

exports.getAllNfts = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: "success",
        requestTime: req.requestTime,
        results: nfts.length,
        data: {
            nfts: nfts,
        },
    });
};

exports.createNFT = (req, res)=> {
    console.log(req);
    const newId = nfts[nfts.length - 1].id + 1;
    const NewNFTs = Object.assign({id: newId}, req.body);

    nfts.push(newNFTs);

    fs.writeFile(`${__dirname}/../nft-data/data/nft-simple.json`, JSON.stringify, err => {
        res.status(201).json({
            status: "success",
            nft: newNFTs
        });
    });
};

// Get single NFT by id
exports.getSingleNFT = (req, res) => {
  // console.log(req.params);
  const id = req.params.id * 1;
  const nft = nfts.find((el) => el.id === id);

  // validate id
  if (!nft) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      nft,
    },
  });
};

exports.updateNFT = (req, res) => {
  if (req.params.id * 1 > nfts.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      nft: "Updating nft",
    },
  });
};

exports.deleteNFT = (req, res) => {
    if(req.params.id * 1 > nfts.length){
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID",
        });
    }
    
    res.status(204).json({
        status: "success",
        data: "null"
    })
};