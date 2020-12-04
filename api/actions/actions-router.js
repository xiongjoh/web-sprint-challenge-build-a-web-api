// Write your "actions" router here!
const express = require('express')
const actions = require('./actions-model')

const router = express.Router()

// middleware
async function checkActionId(req, res, next) {
    const { id } = req.params
    try {
        const myAction = await actions.get(id)
        if (!myAction) {
            res.status(404).json([])
        }
        else {
            req.actionInfo = myAction
            next()
        }
    }
    catch(error) {
        next(error)
    }
}

function checkActionFields(req, res, next) {
    if(!req.body) {
        res.status(400).json({message:"no body found for request"})
        return
    } else if (!req.body.project_id || !req.body.description || !req.body.notes) {
        res.status(400).json({message:"please provide a project_id, description, and notes"})
        return
    } else {
        next()
    }
}

// endpoints
router.get('/', async (req, res, next) => {
    try {
        const myActions = await actions.get()
        if (myActions) {
            res.status(200).json(myActions)
        } else {
            res.status(404).json({message: "actions not found"})
        }
    }
    catch (error) {
        next(error)
    }
})
router.get('/:id', checkActionId ,async (req, res, next) => {
    res.status(200).json(req.actionInfo)
})
router.post('/', checkActionFields,async (req, res, next) => {
    try {
        const insertedAction = await actions.insert(req.body)
        res.status(201).json(insertedAction)
    } catch(error) {
        next(error)
    }
})
router.put('/:id',checkActionId, checkActionFields, async (req, res, next) => {
    const { id } = req.params
    try {
        const updatedAction = await actions.update(id, req.body)
        res.status(201).json(updatedAction)
    } catch(error) {
        next(error)
    }
})
router.delete('/:id',checkActionId, async (req, res, next) => {
    const { id } = req.params
    try {
        const deletedAction = await actions.remove(id)
        console.log(deletedAction)
        res.status(200).json(req.actionInfo)
    } catch(error) {
        next(error)
    }
})

// catch all errors
router.use((err, req, res, next) => {
    res.status(500).json({
        message:'Something has happened, unable to access database',
        error: err.message
    })
})

module.exports = router