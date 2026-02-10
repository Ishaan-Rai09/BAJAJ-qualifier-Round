const express = require('express');
const router = express.Router();
const healthController = require('./controllers/healthController');
const bfhlController = require('./controllers/bfhlController');

router.get('/health', healthController);
router.post('/bfhl', bfhlController);

module.exports = router;
