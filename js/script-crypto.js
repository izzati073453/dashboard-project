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

    // Insert result and canvas
    document.getElementById("crypto-result").innerHTML = `
      <div style="padding: 20px; background-color: #fff9e6; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-top: 20px;">
        <h3>${name} (${symbol})</h3>
        <p><strong>Current Price (USD):</strong> $${price}</p>
        <p><strong>Market Cap Rank:</strong> ${rank}</p>
        <img src="${img}" alt="${name} logo" style="width: 40px; height: 40px;" />
        <canvas id="priceChart" width="400" height="200" style="margin-top:20px;"></canvas>
      </div>
    `;

    // Render chart
    const ctx = document.getElementById("priceChart").getContext("2d");
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Current Price'],
        datasets: [{
          label: `${name} Price (USD)`,
          data: [price],
          backgroundColor: '#4bc0c0',
          borderColor: '#009688',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

  } catch (error) {
    document.getElementById("crypto-result").innerHTML =
      `<p style="color:red;">Crypto not found or API error.</p>`;
    console.error(error);
  }
}
