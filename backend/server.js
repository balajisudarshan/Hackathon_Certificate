const express = require('express')

const connectDb = require('./config/db')
const app = express();
const authRoute = require('./routes/auth.route')
require('dotenv').config()

const PORT = process.env.PORT
app.use(express.json());
app.use('/api/auth',authRoute)
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
})

