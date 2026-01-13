const express = require('express');
const router = express.Router();
const { phoneLogin } = require('../controllers/phoneAuthController');

router.post('/phone-login', phoneLogin);

module.exports = router;
