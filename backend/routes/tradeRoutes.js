const express = require('express');
const { createTrade, getTrades, updateTrade } = require('../controllers/tradeController');
const authMiddleware = require('../utils/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createTrade);
router.get('/', getTrades);
router.put('/', authMiddleware, updateTrade);

module.exports = router;
