const express = require("express");
const router = express.Router();
const { getWeather, searchWeather } = require("../controllers/weatherController");

router.get("/", getWeather);
router.get("/search", searchWeather);

module.exports = router;
