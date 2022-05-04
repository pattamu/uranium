const express = require('express');
const router = express.Router();
const collegeController = require('../controller/collegeController')
const {createIntern, getInters} = require('../controller/internController')

//open-college-intern route Hndlers
router.post("/functionup/colleges", collegeController)
router.post("/functionup/interns", createIntern)
router.get("/functionup/collegeDetails", getInters)

module.exports = router;