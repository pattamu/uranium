const express = require('express');
const router = express.Router();
const controller = require("../controllers/axiosController")

//Axios-Api indirec call route handlers
router.get("/appointment/sessions", controller.getVaccSessions)
router.get("/weather/data", controller.getWeatherdata)
router.post("/memes", controller.getMemes)

module.exports = router;



