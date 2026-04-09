const getWeather = async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ message: "Latitude and Longitude are required" });
    }

    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;

    try {
        const [weatherResponse, geoResponse] = await Promise.all([
            fetch(weatherUrl),
            fetch(geoUrl)
        ]);

        if (!weatherResponse.ok) {
            const errorData = await weatherResponse.json();
            return res.status(weatherResponse.status).json({ message: errorData.message || "Error fetching weather data" });
        }

        const data = await weatherResponse.json();
        
        // Enhance with accurate name from Geocoding API if available
        if (geoResponse.ok) {
            const geoData = await geoResponse.json();
            if (geoData.length > 0) {
                const accurateLoc = geoData[0];
                data.name = accurateLoc.name;
                if (accurateLoc.state) data.name += `, ${accurateLoc.state}`;
                // Optional: Store detailed info for frontend
                data.sys.country_full = accurateLoc.country;
            }
        }

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
    
    try {
        // First resolve city to precise coords using Geocoding API
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoResponse.ok || geoData.length === 0) {
            return res.status(404).json({ message: "City not found" });
        }

        const { lat, lon, name, state, country } = geoData[0];
        
        // Now fetch weather using precise coords
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        const weatherResponse = await fetch(weatherUrl);
        
        if (!weatherResponse.ok) {
            const errorData = await weatherResponse.json();
            return res.status(weatherResponse.status).json({ message: errorData.message || "Error fetching weather data" });
        }

        const data = await weatherResponse.json();
        
        // Standardize the name to the accurate one resolved
        data.name = name;
        if (state) data.name += `, ${state}`;
        data.sys.country_full = country;

        res.json(data);
    } catch (error) {
        console.error("Weather Search Error:", error);
        res.status(500).json({ message: "Internal server error while searching weather" });
    }
};


const getForecast = async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ message: "Latitude and Longitude are required" });
    }

    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ message: errorData.message || "Error fetching forecast data" });
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Forecast Fetch Error:", error);
        res.status(500).json({ message: "Internal server error while fetching forecast" });
    }
};

const getAQI = async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ message: "Latitude and Longitude are required" });
    }

    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ message: errorData.message || "Error fetching AQI data" });
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("AQI Fetch Error:", error);
        res.status(500).json({ message: "Internal server error while fetching AQI" });
    }
};

module.exports = {
    getWeather,
    searchWeather,
    getForecast,
    getAQI
};
