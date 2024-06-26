const mongoose = require('mongoose');

const energySchema = new mongoose.Schema(
    {
        energy1: {
            type: Number,
            require: true,
        },
        energy2: {
            type: Number,
            require: true,
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model('Energy', energySchema);