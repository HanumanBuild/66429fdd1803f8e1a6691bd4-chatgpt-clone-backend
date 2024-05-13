const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/chatController');
const auth = require('../middleware/auth');

router.get('/messages', auth, getMessages);
router.post('/messages', auth, sendMessage);

module.exports = router;
