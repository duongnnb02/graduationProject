const Energy = require('../models/energy');

const getEnergy = async (req, res) => {
    try {
        const all = await Energy.find();
        res.json(all);
    } catch (err) {
        console.log(err);
    }
}

module.exports = {getEnergy};