import { useState } from "react";
import "./weather.css";

const Weather = () => {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [error, setError] = useState("");

    const fetchWeather = async () => {
        if (!city) {
            setError("City name is required");
            return;
        }
        setError("");

        try {
            const weatherRes = await fetch(`https://weather-dashboard-uci2.onrender.com/api/weather?city=${city}`);
            const forecastRes = await fetch(`https://weather-dashboard-uci2.onrender.com/api/forecast?city=${city}`);

            const weatherData = await weatherRes.json();
            const forecastData = await forecastRes.json();

            if (weatherRes.ok && forecastRes.ok) {
                setWeather(weatherData);
                setForecast(forecastData);
            } else {
                setError(weatherData.error || "Failed to fetch weather data");
            }
        } catch (err) {
            setError("Server error. Please try again.");
        }
    };

    return (
        <div className="weather-container">
            <div className="weather-card">
                <h1 className="weather-title">🌍 Weather App</h1>

                <div className="input-container">
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && fetchWeather()}
                        placeholder="Enter city name..."
                        className="weather-input"
                    />
                    <button onClick={fetchWeather} className="weather-button">Search</button>
                </div>

                {error && <p className="error-message">{error}</p>}

                {weather && (
                    <>
                        <div className="weather-info">
                            <h2>{weather.name}, {weather.sys.country}</h2>
                            <div className="temp-box">
                                <h1>{Math.round(weather.main.temp)}°C</h1>
                                <p>{weather.weather[0].description}</p>
                            </div>
                        </div>

                        {/* Current Conditions (4 Square Boxes) */}
                        <div className="current-conditions">
                            <div className="condition-card">🌬️ Wind: {weather.wind.speed} m/s</div>
                            <div className="condition-card">💧 Humidity: {weather.main.humidity}%</div>
                            <div className="condition-card">☀️ UV Index: 7 (High)</div>
                            <div className="condition-card">🌡️ Pressure: {weather.main.pressure} hPa</div>
                        </div>

                        {/* Sunrise & Sunset (Rectangle) */}
                        <div className="sunrise-sunset">
    <h3>🌞 Sun & Atmosphere</h3>
    <p>🌅 Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
    <p>🌇 Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
    <p>☁️ Cloud Cover: {weather.clouds.all}%</p>
    <p>🔆 Visibility: {weather.visibility / 1000} km</p>
</div>


                        {/* Hourly Forecast for Today */}
                        {forecast && (
                            <div className="hourly-forecast">
                                <h3>Today's Hourly Forecast</h3>
                                <div className="hourly-scroll">
                                    {forecast.list
                                        .filter(entry => {
                                            const entryDate = new Date(entry.dt * 1000);
                                            const today = new Date();
                                            return entryDate.getDate() === today.getDate();
                                        })
                                        .map((entry, index) => (
                                            <div key={index} className="hour-card">
                                                <p>{new Date(entry.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                <img src={`http://openweathermap.org/img/wn/${entry.weather[0].icon}.png`} alt="weather icon" />
                                                <p>{Math.round(entry.main.temp)}°C</p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* 6-Day Forecast */}
                        {forecast && forecast.list && (
                            <div className="forecast-container">
                                <h3>6-Day Forecast</h3>
                                {Object.values(
                                    forecast.list.reduce((acc, entry) => {
                                        const date = new Date(entry.dt * 1000);
                                        const formattedDate = date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

                                        if (!acc[formattedDate]) {
                                            acc[formattedDate] = entry;
                                        }

                                        return acc;
                                    }, {})
                                ).slice(0, 6).map((entry, index) => {
                                    const date = new Date(entry.dt * 1000);
                                    const formattedDate = date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

                                    return (
                                        <div key={index} className="forecast-card">
                                            <p>{formattedDate}</p>
                                            <img src={`http://openweathermap.org/img/wn/${entry.weather[0].icon}.png`} alt="weather icon" />
                                            <p>{Math.round(entry.main.temp)}°C</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Weather;
