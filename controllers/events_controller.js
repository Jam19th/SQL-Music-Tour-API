//Dependencies
const events = require('express').Router();
const db = require('../models');
const { Op } = require('sequelize');
const { Event, MeetGreet, SetTime, Stage, Band } = db;

// Find all events in the database
events.get('/', async (req, res) => {
    const { name = '', limit = 10, offset = 0 } = req.query;

    try {
        const foundEvents = await Event.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${name}%`
                }
            },
            order: [
                ['date', 'ASC'],
                ['name', 'ASC']
            ],
            limit,
            offset
        })
        res.status(200).json({ foundEvents });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});

// Find one event by id
events.get('/:name', async (req, res) => {
    const { event: eventName = '' } = req.params

    try {
        const foundEvent = await Event.findOne({
            attributes: {
                exclude:
                    ['event_id']
            },
            where: {
                name: {
                    [Op.iLike]: `%${eventName}%`
                }
            },
            include: [
                {
                    model: MeetGreet,
                    as: 'meetAndGreets',
                    attributes: {
                        exclude:
                            ['meet_greet_id', 'event_id', 'band_id']
                    },
                    include: {
                        model: Band,
                        as: 'band',
                        attributes: {
                            exclude:
                                ['band_id']
                        }
                    }
                },
                {
                    model: SetTime,
                    as: 'setTimes',
                    attributes: {
                        exclude:
                            ['set_times_id', 'event_id', 'band_id', 'stage_id']
                    },
                    include: [
                        {
                            model: Band,
                            as: 'band',
                            attributes: {
                                exclude:
                                    ['band_id']
                            }
                        },
                        {
                            model: Stage,
                            as: 'stage',
                            attributes: {
                                exclude:
                                    ['stage_id']
                            }
                        }
                    ]
                },
                {
                    model: Stage,
                    as: 'stages',
                    attributes: {
                        exclude:
                            ['stage_id']
                    },
                    through: {
                        attributes: []
                    }
                }
            ],
            order: [
                [{ model: MeetGreet, as: 'meetAndGreets' }, 'meet_start_time', 'ASC'],
                [{ model: SetTime, as: 'setTimes' }, 'start_time', 'ASC']
            ]
        })
        res.status(200).json({ foundEvent });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});

// Create a new event
events.post('/', async (req, res) => {
    try {
        const newEvent = await Event.create(req.body)
        res.status(200).json({
            message: 'Successfully inserted a new event',
            data: newEvent
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});

// Update an event by id
events.put('/:id', async (req, res) => {
    try {
        const updatedEvents = await Event.update(req.body, {
            where: { event_id: req.params.id },
            returning: true
        })
        res.status(200).json({
            message: 'Successfully updated an event',
            data: updatedEvents
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});

// Delete an event by id
events.delete('/:id', async (req, res) => {
    try {
        const deletedEvents = await Event.destroy({
            where: { event_id: req.params.id }
        })
        res.status(200).json({
            message: 'Successfully deleted an event',
            data: deletedEvents
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});

// Export the events controller
module.exports = events;