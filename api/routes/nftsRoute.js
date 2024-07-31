const express = require("express");
const nftsControllers = require("./../controllers/nftsControllers");

const router = express.Router();    

router.param("id", nftsControllers.checkId);

// NFT Router
router.route("/")
   .get(nftsControllers.getAllNfts)
   .post(nftsControllers.checkBody, nftsControllers.createNFT);

router.route("/:id")
   .get(nftsControllers.getSingleNFT)
   .patch(nftsControllers.updateNFT)
   .delete(nftsControllers.deleteNFT);

module.exports = router;