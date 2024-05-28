const mongoose = require('mongoose');

const monthlyEnergySchema = new mongoose.Schema(
    {
        energyMonth: {
            type: Number,
        },
        month: {
            type: Number,
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model('MonthlyEnergy', monthlyEnergySchema);