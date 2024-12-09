const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;


// Fetch city suggestions using Geo API
app.get('/cities', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City query parameter is required' });
  }

  try {
    const response = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q: city,
        appid: process.env.API_KEY,
      },
    });
    res.json(response.data); // Return city suggestions
  } catch (error) {
    console.error('Error fetching city data:', error.message);
    res.status(500).json({ error: 'Failed to fetch city data' });
  }
});

// Fetch weather details using One Call API
app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const response = await axios.get('https://api.openweathermap.org/data/3.0/onecall', {
      params: {
        lat,
        lon,
        appid: process.env.API_KEY,
        units: 'imperial', // Fahrenheit
      },
    });
    res.json(response.data); // Return weather data
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(PORT, () => console.log(`Proxy server running on http://localhost:${PORT}`));
