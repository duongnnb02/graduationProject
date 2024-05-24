const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema(
    {
        device: {
            type: String,
            required: true,
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model('Device', deviceSchema);