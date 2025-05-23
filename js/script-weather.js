async function getWeather() {
  const city = document.getElementById("city-input").value;
  const apiKey = "848b878cf83330851f7a4a8ab2c0db23"; // Replace with your actual API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("City not found.");
    }
    const data = await response.json();

    // Fill in span values in your HTML
    document.getElementById("city-name").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("temp").textContent = data.main.temp;
    document.getElementById("humidity").textContent = data.main.humidity;
    document.getElementById("condition").textContent = data.weather[0].description;
  } catch (error) {
    document.getElementById("city-name").textContent = "City not found or API error.";
    document.getElementById("temp").textContent = "-";
    document.getElementById("humidity").textContent = "-";
    document.getElementById("condition").textContent = "-";
  }
}
