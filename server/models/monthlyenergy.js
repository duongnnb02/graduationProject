const mongoose = require('mongoose');

const monthlyEnergySchema = new mongoose.Schema(
    {
        energyMonth1: {
            type: Number,
        },
        energyMonth2: {
            type: Number,
        },
        month: {
            type: Number,
        },
        year: {
            type: Number,
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model('MonthlyEnergy', monthlyEnergySchema);