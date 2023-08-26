//Dependencies
const stages = require('express').Router();
const db = require('../models');
const { Op } = require('sequelize');
const { Stage } = db;

// Find all stages in the database
stages.get('/', async (req, res) => {
    const { name = '', limit = 2, offset = 0 } = req.query;

    try {
        const foundStages = await Stage.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${name}%`
                }
            },
            order: [
                ['capacity', 'DESC'],
                ['manager', 'ASC']
            ],
            limit,
            offset
        })
        res.status(200).json({ foundStages });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});

// Find one stage by id
stages.get('/:id', async (req, res) => {
    try {
        const foundStage = await Stage.findOne({
            where: { stage_id: req.params.id }
        })
        res.status(200).json({ foundStage });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});

// Create a new stage
stages.post('/', async (req, res) => {
    try {
        const newStage = await Stage.create(req.body)
        res.status(200).json({
            message: 'Successfully inserted a new stage',
            data: newStage
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});

// Update a stage by id
stages.put('/:id', async (req, res) => {
    try {
        const updatedStages = await Stage.update(req.body, {
            where: { stage_id: req.params.id },
            returning: true
        })
        res.status(200).json({
            message: 'Successfully updated stage',
            data: updatedStages
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});

// Delete a stage by id
stages.delete('/:id', async (req, res) => {
    try {
        const deletedStage = await Stage.destroy({
            where: { stage_id: req.params.id }
        })
        res.status(200).json({
            message: 'Successfully deleted stage',
            data: deletedStage
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message })
    }
});

//Export the stages controller
module.exports = stages;