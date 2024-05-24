const Device = require('../models/device');

const addDevice = async (req, res) => {
    console.log(req.body);
    try {
        const device = await new Device({ ...req.body }).save();
        res.json(device);
    } catch (err) {
        console.log(err);
    }
}

const getDevice = async (req, res) => {
    try {
        const all = await Device.find().sort({ createdAt: -1 }).limit(500);
        res.json(all);
    } catch (err) {
        console.log(err);
    }
}

module.exports = {addDevice, getDevice};