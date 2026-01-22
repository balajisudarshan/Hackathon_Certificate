const express = require('express')

const connectDb = require('./config/db')
const app = express();
require('dotenv').config()

const PORT = process.env.PORT
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
})

