require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const mqtt = require('mqtt');

const Energy = require('./models/energy');
const MonthlyEnergy = require('./models/monthlyenergy');

const AuthRoutes = require('./routes/auth');
const DeviceRoutes = require('./routes/device');
const EnergyRoutes = require('./routes/energy');
const MonthlyEnergyRoutes = require('./routes/monthlyenergy');
const topicEnergy = 'Energy';
const topicMonthlyEnergy = 'monthlyenergy';

const app = express();

//db connection
mongoose.connect(process.env.DATABASE)
.then(() => console.log("DB connected"))
.catch((err) => console.log("DB connection error: ", err));

//mqtt connection
const client = mqtt.connect('mqtt://broker.emqx.io:1883');
client.on('connect', async() => {
    console.log('MQTT Connected');
    client.subscribe(topicEnergy);
    client.subscribe(topicMonthlyEnergy);
})

//mqtt receiving data
client.on('message', async(topic, message) => {
    if (topic === topicEnergy) {
        let data = message.toString();
        data = JSON.parse(data);
        await saveData(data);
    }
    if (topic === topicMonthlyEnergy) {
        let data = message.toString();
        data = JSON.parse(data);
        await saveMonthlyData(data);
    }
});

saveData = async (data) => {
    data = new Energy(data);
    data = await data.save();
};

saveMonthlyData = async (data) => {
    data = new MonthlyEnergy(data);
    data = await data.save();
}

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(morgan('dev'));

//route
app.use('/api', AuthRoutes);
app.use('/api', DeviceRoutes);
app.use('/api', EnergyRoutes);
app.use('/api', MonthlyEnergyRoutes);

app.listen(8000, () => console.log("Server running on port 8000"));