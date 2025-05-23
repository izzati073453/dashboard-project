// script-crypto.js
async function loadCrypto() {
  const url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network error");

    const data = await response.json();

    const result = 
      <div style="padding: 20px; background-color: #fff9e6; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-top: 20px;">
        <h3 style="margin-bottom: 10px;">Live Crypto Prices</h3>
        <p><strong>Bitcoin (BTC):</strong> $${data.bitcoin.usd}</p>
        <p><strong>Ethereum (ETH):</strong> $${data.ethereum.usd}</p>
      </div>
    ;
    document.getElementById("crypto-result").innerHTML = result;
  } catch (error) {
    document.getElementById("crypto-result").innerHTML = <p style="color:red;">Failed to load crypto prices. Please try again later.</p>;
  }
}

// Auto-load prices on page load
loadCrypto();