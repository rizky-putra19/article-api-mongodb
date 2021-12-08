require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8080
const mongoose = require('mongoose')
const Router = require('./routes')

app.use(cors());
app.use(express.json());

mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true },
    () => console.log('database connect')
);

app.use('/api/v1', Router);

app.get('/', (req, res) => {
    return res.status(200).json({
        status: "running",
        message: "server connected"
    })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
