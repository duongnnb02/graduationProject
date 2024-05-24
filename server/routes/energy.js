const express = require('express');

const router = express.Router();

const {getEnergy} = require('../controller/energy');

router.get('/get-energy', getEnergy);

module.exports = router;