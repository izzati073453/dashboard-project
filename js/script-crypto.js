let cryptoChart = null;

async function getCryptoPrice() {
  const crypto = document.getElementById("crypto-input").value.toLowerCase();
  const url = `https://api.coingecko.com/api/v3/coins/${crypto}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Crypto not found.");

    const data = await response.json();

    const result = `
      <div style="padding: 20px; background-color: #fff9e6; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-top: 20px;">
        <h3 style="margin-bottom: 10px;">${data.name} (${data.symbol.toUpperCase()})</h3>
        <p><strong>Current Price (USD):</strong> $${data.market_data.current_price.usd}</p>
        <p><strong>Market Cap Rank:</strong> ${data.market_cap_rank}</p>
        <img src="${data.image.small}" alt="${data.name} logo" style="margin-top: 10px; width: 40px; height: 40px;" />
        <canvas id="priceChart" width="400" height="200" style="margin-top: 20px;"></canvas>
      </div>
    `;
    document.getElementById("crypto-result").innerHTML = result;

    // Fetch 7-day price chart
    const chartResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=usd&days=7`);
    const chartData = await chartResponse.json();

    const labels = chartData.prices.map(price => {
      const date = new Date(price[0]);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    const prices = chartData.prices.map(price => price[1]);

    const ctx = document.getElementById("priceChart").getContext("2d");

    if (cryptoChart) cryptoChart.destroy(); // destroy old chart before creating new

    cryptoChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: `${data.name} Price (USD)`,
          data: prices,
          borderColor: "#ff9900",
          backgroundColor: "rgba(255, 165, 0, 0.2)",
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: "Date"
            }
          },
          y: {
            title: {
              display: true,
              text: "Price in USD"
            }
          }
        }
      }
    });

  } catch (error) {
    document.getElementById("crypto-result").innerHTML =
      `<p style="color:red;">Crypto not found or API error.</p>`;
  }
}
