// DEPENDENCIES
const express = require('express')
const app = express()
const { Sequelize } = require('sequelize')

// CONTROLLERS
const bandsController = require('./controllers/bands_controller.js')
const eventsController = require('./controllers/events_controller.js')
const stagesController = require('./controllers/stages_controller.js')

// CONFIGURATION / MIDDLEWARE
require('dotenv').config()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/bands', bandsController)
app.use('/events', eventsController)
app.use('/stages', stagesController)

// ROOT
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Tour API'
    })
})

// 404 error
app.get('*', (req, res) => {
    try {
        res.status(404).json({ message: 'Page not found' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
})

// LISTEN
app.listen(process.env.PORT, () => {
    console.log(`🎸 Rockin' on port: ${process.env.PORT}`)
})