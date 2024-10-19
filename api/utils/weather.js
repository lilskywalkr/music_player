async function callWeather(lat, lon) {
    try {
        const API_KEY = process.env.API_KEY;
        if (!API_KEY) {
            throw new Error("API_KEY is missing in environment variables");
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Failed to fetch weather data, status: ${res.status}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        return error;
    }
}

module.exports = { callWeather };