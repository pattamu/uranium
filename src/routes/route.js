const express = require('express');
const router = express.Router();
const developerController = require("../controllers/developerController")

//Developer-Batch route handlers
router.post("/batches", developerController.createBatch)
router.post("/developers", developerController.createDeveloper)
router.get("/scholarship-developers", developerController.scholarship_developers)
router.get("/developers", developerController.getDeveloper)

module.exports = router;



