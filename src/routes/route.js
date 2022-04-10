const express = require('express');
const router = express.Router();
const controler = require('../controllers/controllers.js')

router.post('/add-player', controler.control4);

module.exports = router;
