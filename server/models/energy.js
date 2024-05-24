const mongoose = require('mongoose');

const energySchema = new mongoose.Schema(
    {
        energy: {
            type: Number,
            require: true,
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model('Energy', energySchema);