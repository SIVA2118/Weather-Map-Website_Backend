const getWeather = async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ message: "Latitude and Longitude are required" });
    }

    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ message: errorData.message || "Error fetching weather data" });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Weather Fetch Error:", error);
        res.status(500).json({ message: "Internal server error while fetching weather data" });
    }
};

const searchWeather = async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ message: "City name is required" });
    }

    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ message: errorData.message || "Error fetching weather data" });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Weather Search Error:", error);
        res.status(500).json({ message: "Internal server error while searching weather" });
    }
};

module.exports = {
    getWeather,
    searchWeather
};
