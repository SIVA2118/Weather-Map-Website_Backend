const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");

router.get("/", weatherController.getWeather);
router.get("/search", weatherController.searchWeather);
router.get("/forecast", weatherController.getForecast);
router.get("/aqi", weatherController.getAQI);

module.exports = router;
