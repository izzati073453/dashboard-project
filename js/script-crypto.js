// Populate dropdown with top 50 coins on page load
document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("crypto-select");
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1");
    const coins = await res.json();
    coins.forEach(coin => {
      const option = document.createElement("option");
      option.value = coin.id;
      option.textContent = `${coin.name} (${coin.symbol.toUpperCase()})`;
      select.appendChild(option);
    });

    // Update input when user picks from dropdown
    select.addEventListener("change", () => {
      document.getElementById("crypto-input").value = select.value;
    });
  } catch (err) {
    console.error("Dropdown fetch failed:", err);
  }
});

// Main price + chart display
async function getCryptoPrice() {
  const crypto = document.getElementById("crypto-input").value.toLowerCase();
  const url = `https://api.coingecko.com/api/v3/coins/${crypto}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Crypto not found.");

    const data = await response.json();
    const price = data.market_data.current_price.usd;
    const symbol = data.symbol.toUpperCase();
    const name = data.name;
    const rank = data.market_cap_rank;
    const img = data.image.small;

    // Show price and canvas
    document.getElementById("crypto-result").innerHTML = `
      <div style="padding: 20px; background-color: #fff9e6; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-top: 20px;">
        <h3>${name} (${symbol})</h3>
        <p><strong>Current Price (USD):</strong> $${price}</p>
        <p><strong>Market Cap Rank:</strong> ${rank}</p>
        <img src="${img}" alt="${name} logo" style="width: 40px; height: 40px;" />
        <canvas id="priceChart" width="400" height="200" style="margin-top:20px;"></canvas>
      </div>
    `;

    getCryptoChart(); // show historical line chart

  } catch (error) {
    document.getElementById("crypto-result").innerHTML =
      `<p style="color:red;">Crypto not found or API error.</p>`;
    console.error(error);
  }
}

// Historical price chart
async function getCryptoChart() {
  const crypto = document.getElementById("crypto-input").value.toLowerCase();
  const range = document.getElementById("time-range").value;
  const url = `https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=usd&days=${range}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Chart data fetch failed");

    const data = await response.json();
    const prices = data.prices;

    const labels = prices.map(entry => {
      const date = new Date(entry[0]);
      return `${date.getMonth()+1}/${date.getDate()}`;
    });

    const values = prices.map(entry => entry[1]);

    const ctx = document.getElementById("priceChart").getContext("2d");

    // Destroy previous chart if it exists
    if (window.priceChartInstance) {
      window.priceChartInstance.destroy();
    }

    window.priceChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `${crypto.toUpperCase()} Price (USD) - Last ${range} days`,
          data: values,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.2
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  } catch (error) {
    console.error("Chart Error:", error);
  }
}
