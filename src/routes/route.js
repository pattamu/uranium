const express = require('express');
const router = express.Router();
const controler = require('../controllers/controllers.js')

router.post('/add-player', controler.control2);

module.exports = router;
