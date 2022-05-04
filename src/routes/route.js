const express = require('express');
const router = express.Router();
const collegeController = require('../controller/collegeController')
const {createIntern, getInters} = require('../controller/internController')

//open-college-intern route Hndlers
router.post("/colleges", collegeController)
router.post("/interns", createIntern)
router.get("/collegeDetails", getInters)

module.exports = router;