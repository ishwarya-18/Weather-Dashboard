require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const WEATHER_API_KEY = process.env.WEATHER_API_KEY; // Get API key from .env file
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// 🌤️ Route to Fetch Weather Data
app.get("/api/weather", async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {

    const response = await axios.get(`${BASE_URL}?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);
    // 🌟 Log before sending    
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching weather:", error?.response?.data || error.message);

    if (error.response?.status === 404) {
      return res.status(404).json({ error: "City not found. Check spelling." });
    }

    return res.status(500).json({ error: "Server error. Please try again." });
  }
});
app.get("/api/forecast", async (req, res) => {
  const city = req.query.city;
  if (!city) {
      return res.status(400).json({ error: "City is required" });
  }

  try {
    const API_KEY = WEATHER_API_KEY; // Use from .env
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
      
    const response = await axios.get(url);
    const data = response.data;    

      if (data.cod !== "200") {
          return res.status(400).json({ error: data.message });
      }

      res.json(data);
  } catch (error) {
      console.error("Forecast API error:", error);
      res.status(500).json({ error: "Server error" });
  }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
