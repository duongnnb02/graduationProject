const express = require('express');

const router = express.Router();

const {addDevice, getDevice} = require('../controller/device');

router.post('/add-device', addDevice);
router.get('/get-device', getDevice);

module.exports = router;