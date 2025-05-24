let weatherChart;

async function getWeather() {
  const city = document.getElementById("city-input").value;
  const filter = document.getElementById("date-filter").value;
  const apiKey = "848b878cf83330851f7a4a8ab2c0db23";

  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  try {
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();
    if (geoData.length === 0) throw new Error("City not found");

    const { lat, lon, name, country } = geoData[0];
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const current = weatherData.list[0];
    document.getElementById("city-name").textContent = `${name}, ${country}`;
    document.getElementById("temp").textContent = current.main.temp;
    document.getElementById("humidity").textContent = current.main.humidity;
    document.getElementById("condition").textContent = current.weather[0].description;

    // Filter berdasarkan dropdown
    const now = new Date();
    const filtered = weatherData.list.filter(entry => {
      const entryDate = new Date(entry.dt * 1000);
      if (filter === "today") {
        return entryDate.getDate() === now.getDate();
      } else if (filter === "tomorrow") {
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        return entryDate.getDate() === tomorrow.getDate();
      } else if (filter === "next3") {
        const end = new Date(now);
        end.setDate(now.getDate() + 3);
        return entryDate >= now && entryDate <= end;
      }
      return true;
    });

    const labels = filtered.map(entry =>
      new Date(entry.dt * 1000).toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })
    );
    const temps = filtered.map(entry => entry.main.temp);

    const ctx = document.getElementById("weatherChart").getContext("2d");

    if (weatherChart) {
      weatherChart.data.labels = labels;
      weatherChart.data.datasets[0].data = temps;
      weatherChart.update();
    } else {
      weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Temperature (°C)',
            data: temps,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.4,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true }
          },
          scales: {
            y: { beginAtZero: false }
          }
        }
      });
    }
  } catch (error) {
    alert(error.message);
    document.getElementById("city-name").textContent = "Error fetching data.";
    document.getElementById("temp").textContent = "-";
    document.getElementById("humidity").textContent = "-";
    document.getElementById("condition").textContent = "-";
  }
}


