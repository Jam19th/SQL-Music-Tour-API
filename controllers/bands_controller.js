//Dependencies
const bands = require('express').Router();
const db = require('../models');
const { Op } = require('sequelize');
const { Band } = db;

// Find all bands in the database
bands.get('/', async (req, res) => {
    const { name = '' } = req.query;

    try {
        const foundBands = await Band.findAll({
            order: [['available_start_time', 'ASC'], ['name', 'ASC']],
            where: { 
                name: {
                    [Op.iLike]: `%${name}%`
                }
            }
        })
        res.status(200).json({ foundBands });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
})

// Find one band by id
bands.get('/:id', async (req, res) => {
    try {
        const foundBand = await Band.findOne({
            where: { band_id: req.params.id }
        })
        res.status(200).json({ foundBand });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
})

// Create a new band
bands.post('/', async (req, res) => {
    try {
        const newBand = await Band.create(req.body)
        res.status(200).json({
            message: 'Successfully inserted a new band',
            data: newBand
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
})

// Update a band by id
bands.put('/:id', async (req, res) => {
    try {
        const updatedBands = await Band.update(req.body, {
            where: { band_id: req.params.id },
            returning: true
        })
        res.status(200).json({
            message: `Successfully updated ${updatedBands} band(s)`,
            data: updatedBands
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
})

// Delete a band by id
bands.delete('/:id', async (req, res) => {
    try {
        const deletedBands = await Band.destroy({
            where: { band_id: req.params.id }
        })
        res.status(200).json({
            message: `Successfully deleted ${deletedBands} band(s)`,
            data: deletedBands
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
})

// 404 error
// bands.get('*', (req, res) => {
//     try {
//         res.status(404).json({ message: 'Page not found' });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: 'Something went wrong', error: error.message });
//     }
// })

// Export the bands controller
module.exports = bands;
