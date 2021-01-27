const express = require('express');
const { Measurement } = require('../models/measurement');
const router = express.Router();

let { UseCase } = require('../models/useCase');

// post method - creation of a new usecase
router.post('/', (req, res, next) => {
    let useCase = {
        name: req.body.name,
        measurementOptions: req.body.measurementOptions,
        pinCode: UseCase.generateHash(req.body.pinCode)
    }

    UseCase.create(useCase).then(result => {
        res.status(201).json(result)    
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    })
})

// get all use cases
router.get("/", (req, res, next) => {
    UseCase.findAll()
    .then(data => {
        res.status(200).json(data);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    })
});

// get specific usecase by id
router.get("/:id", (req, res, next) => {
    let useCaseId = req.params.id
    
    UseCase.findOne({ where: 
        { 'id': useCaseId }
    })
    .then(data => {
        res.status(200).json(data);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    })
});

// get measurements of a specific usecase
router.get("/:id/measurements", (req, res, next) => {
    let useCaseId = req.params.id

    UseCase.findOne({
        where: 
        { 'id': useCaseId },
        include: [
            { model: Measurement, attributes: [ "groupName", "value", "timestamp" ]}
        ],
        order: [
            [ Measurement, 'timestamp', 'DESC'],
        ]
    })
    .then(data => {
        res.status(200).json(data);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    })
});

// verify if a given user provided the currect password
router.post("/:id/authorize", (req, res, next) => {
    let useCaseId = req.params.id
    let pinCode = req.body.pinCode

    UseCase.findOne({ where: 
        { 'id': useCaseId }
    })
    .then(useCase => {
        if(useCase) {
            if(useCase.validPinCode(pinCode)) {
                res.status(200).json("Authenticated successfully")
            } else {
                res.status(401).json({
                    error: "Unauthorized access, wrong pin provided"
                })
            }
        } else {
            res.status(404).json({
                error: "Use case with given id could not be found"
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    })
});

// update usecase based on usecase id
router.put("/:id", (req, res, next) => {
    let useCaseId = req.params.id
    let updatedUseCase = {
        name: req.body.name,
        measurementOptions: req.body.measurementOptions,
    }
    
    UseCase.findOne({ where:
        { 'id': useCaseId }
    })
    .then(useCase => {
        if(useCase) {
            if(useCase.validPinCode(req.body.pinCode)) {
                useCase.update(updatedUseCase)
                res.status(200).json(useCase)
            } else {
                res.status(401).json({
                    error: "Unauthorized access, wrong pin provided"
                })
            }
        } else {
            res.status(404).json({
                error: "Use case with given id could not be found"
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    })
});

// delete usecase based on id
router.delete("/:id", (req, res, next) => {
    let useCaseId = req.params.id

    UseCase.destroy({
        where: { 'id': useCaseId }
    })
    .then(data => {
        res.status(200).json({
            data
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        });
    })
});

module.exports = router;