//Dependencies
const bands = require('express').Router();
const db = require('../models');
const { Op } = require('sequelize');
const { Band, MeetGreet, Event, SetTime } = db;

// Find all bands in the database
bands.get('/', async (req, res) => {
    const { name = '', limit = 10, offset = 0 } = req.query;

    try {
        const foundBands = await Band.findAll({
            order: [
                ['available_start_time', 'ASC'],
                ['name', 'ASC']
            ],
            where: {
                name: {
                    [Op.iLike]: `%${name}%`
                }
            },
            limit,
            offset
        })
        res.status(200).json({ foundBands });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
})

// Find one band by id
bands.get('/:name', async (req, res) => {
    const { event: eventName = '' } = req.params

    const where = {
        name: {
            [Op.iLike]: `%${eventName}%`
        }
    }

    try {
        // console.log("finding band");
        const foundBand = await Band.findOne({
            attributes: {
                exclude:
                    ['band_id']
            },
            where: {
                name: {
                    [Op.iLike]: `%${req.params.name}%`
                }
            },
            include: [
                {
                    model: MeetGreet,
                    as: 'meetGreets',
                    attributes: {
                        exclude:
                            ['meet_greet_id', 'event_id', 'band_id']
                    },
                    include: {
                        model: Event,
                        attributes: {
                            exclude:
                                ['event_id']
                        },
                        as: 'event',
                        where
                    }
                },
                {
                    model: SetTime,
                    as: 'setTimes',
                attributes: {
                    exclude:
                        ['set_times_id', 'event_id', 'band_id', 'stage_id']
                },
                    include: {
                        model: Event,
                        as: 'event',
                attributes: {
                    exclude:
                        ['event_id']
                },
                        where
                    }
                }
            ],
            order: [
                [{ model: MeetGreet, as: 'meetGreets' }, { model: Event, as: 'event' }, 'date', 'ASC'],
                [{ model: SetTime, as: 'setTimes' }, { model: Event, as: 'event' }, 'date', 'ASC']
            ]
        })
        console.log("found band", foundBand);
        res.status(200).json({ foundBand });
    } catch (error) {
        console.log("error", error);
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

// Export the bands controller
module.exports = bands;