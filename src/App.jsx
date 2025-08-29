import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setWeatherData(null);

    if (!city) {
      setError("Please enter a city name.");
      return;
    }

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found!");
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weather = await weatherRes.json();

      setWeatherData({
        ...weather.current_weather,
        location: `${name}, ${country}`,
      });
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("Failed to fetch weather. Please try again.");
    }
  };

  return (
    <div className="app-container">
      <h1>Weather Now</h1>
      <p>Get real-time weather updates of your city 🌤️</p>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="weather-info">
          <h2>Current Weather in {weatherData.location}</h2>
          <p>🌡️ Temperature: {weatherData.temperature} °C</p>
          <p>💨 Windspeed: {weatherData.windspeed} km/h</p>
          <p>⏰ Time: {weatherData.time}</p>
        </div>
      )}
    </div>
  );
}

export default App;
