// script-weather.js
async function getWeather() {
  const city = document.getElementById("city").value;
  const apiKey = "848b878cf83330851f7a4a8ab2c0db23"; // Replace with your actual API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("City not found.");
    }
    const data = await response.json();

    const result = `
      <div style="padding: 20px; background-color: #eaf4ff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-top: 20px;">
        <h3 style="margin-bottom: 10px;">${data.name}, ${data.sys.country}</h3>
        <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Weather:</strong> ${data.weather[0].description}</p>
      </div>
    `;
    document.getElementById("weather-result").innerHTML = result;
  } catch (error) {
    document.getElementById("weather-result").innerHTML = `<p style="color:red;">City not found or API error.</p>`;
  }
}
