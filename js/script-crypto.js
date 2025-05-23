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
      </div>
    `;
    document.getElementById("crypto-result").innerHTML = result;
  } catch (error) {
    document.getElementById("crypto-result").innerHTML =
      `<p style="color:red;">Crypto not found or API error.</p>`;
  }
}
