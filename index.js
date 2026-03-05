require("dotenv").config();
const express = require("express");
const cors = require("cors");
const weatherRoutes = require("./routes/weather");

const app = express();

app.use(cors());
app.use(express.json());

// Main weather route
app.use("/api/weather", weatherRoutes);

// Base route for health check
app.get("/", (req, res) => {
    res.json({ message: "Weather Satellite API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
