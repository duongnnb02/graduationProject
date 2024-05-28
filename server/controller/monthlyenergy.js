const MonthlyEnergy = require('../models/monthlyenergy');

const getMonthlyEnergy = async (req, res) => {
    try {
        const all = await MonthlyEnergy.find();
        res.json(all);
    } catch (err) {
        console.log(err);
    }
}

module.exports = {getMonthlyEnergy};