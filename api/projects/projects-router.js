// Write your "projects" router here!
const express = require('express')
const projects = require('./projects-model')

const router = express.Router()

// middleware
async function checkProjectId(req, res, next) {
    const { id } = req.params

    try {
        const myProject = await projects.get(id)
        if(!myProject) {
            res.status(404).json([])
        } else {
            req.projectInfo = myProject
            next()
        }
    } catch(error) {
        next(error)
    }
}

async function checkPostedProject(req, res, next) {
    if(!req.body) {
        res.status(400).json({message:`no body found`})
    } else if (!req.body.name || !req.body.description) {
        res.status(400).json({message:"please include a name and description"})
    } else {
        next()
    }
}

// endpoints
router.get('/', checkProjectId, async (req, res, next) => {
    try {
        const myProjects = await projects.get()
        if(myProjects) {
            res.status(200).json(myProjects)
        } else {
            res.status(404).json({message:"projects not found"})
        }
    } catch(error) {
        next(error)
    }
})
router.get('/:id', checkProjectId, async (req, res, next) => {
    res.status(200).json(req.projectInfo)
})
router.get('/:id/actions', checkProjectId, async (req, res, next) => {
    const actionInfo = req.projectInfo.actions
    res.status(200).json(actionInfo)
})
router.post('/', checkPostedProject, async (req, res, next) => {
    try {
        const insertedProject = await projects.insert(req.body)
        res.status(201).json(insertedProject)
    } catch(error) {
        next(error)
    }
})
router.put('/:id', checkPostedProject, checkProjectId, async (req, res, next) => {
    const { id } = req.params
    try {
        const updatedProject = await projects.update(id, req.body)
        res.status(201).json(updatedProject)
    } catch(error) {
        next(error)
    }
})
router.delete('/:id', checkProjectId, async (req, res, next) => {
    const { id } = req.params
    try {
        await projects.remove(id)
        res.json(req.projectInfo)
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