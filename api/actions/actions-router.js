// Write your "actions" router here!
const express = require('express')
const actions = require('./actions-model')

const router = express.Router()

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
router.get('/:id', async (req, res, next) => {
    try {
        
    }
    catch (error) {
        next(error)
    }
})
router.post('/', async (req, res, next) => {
    
})
router.put('/', async (req, res, next) => {
    
})
router.delete('/', async (req, res, next) => {
    
})

router.use((err, req, res, next) => {
    res.status(500).json({
        message:'Something has happened, unable to access database',
        error: err.message
    })
})

module.exports = router