const express = require('express');
const { createNFT, getNFTs } = require('../controllers/nftController');
const authMiddleware = require('../utils/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createNFT);
router.get('/', getNFTs);

module.exports = router;
