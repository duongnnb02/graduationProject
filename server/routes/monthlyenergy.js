const express = require('express');

const router = express.Router();

const {getMonthlyEnergy} = require('../controller/monthlyenergy');

router.get('/get-monthlyenergy', getMonthlyEnergy);

module.exports = router;