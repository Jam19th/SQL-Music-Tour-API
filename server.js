// DEPENDENCIES
const express = require('express')
const app = express()
const { Sequelize } = require('sequelize')

// CONFIGURATION / MIDDLEWARE
require('dotenv').config()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Sequelize connection
const sequelize = new Sequelize({
    storage: process.env.PG_URI,
    dialect: 'postgres',
    username: 'postgres',
    password: 'chobits',
});

// Test connection
try {
    console.log(process.env.PG_URI);
    sequelize.authenticate();
    console.log(`Connected with Sequelize at ${process.env.PG_URI}`);
} catch (error) {
    console.error(`Unable to connect to PG: ${error}`);
}

// ROOT
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Tour API'
    })
})

// LISTEN
app.listen(process.env.PORT, () => {
    console.log(`🎸 Rockin' on port: ${process.env.PORT}`)
})