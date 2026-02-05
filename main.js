// ==============================
// Admin-configured stock list
// ==============================

// This array represents the popular stocks that an administrator sets up.
// Later, you could load this data from a database or an API instead of hardcoding it.
const popularStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 193.12 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 415.27 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 152.04 }
];


// ==============================
// Function to render the stocks
// ==============================

// This function finds the <ul id="stock-list"> element on the page
// and fills it with <li> items based on the popularStocks array.
function renderPopularStocks() {
  // Get a reference to the list in the HTML
  const list = document.getElementById("stock-list");

  // If the element doesn't exist on this page, stop the function.
  // This lets you reuse the same JS file on pages that don't have the list.
  if (!list) return;

  // Clear any existing list items before adding new ones
  list.innerHTML = "";

  // Loop through each stock in the array
  popularStocks.forEach(stock => {
    // Create a new <li> for this stock
    const li = document.createElement("li");

    // Create a <span> for the stock symbol and name (left side)
    const leftSpan = document.createElement("span");
    leftSpan.className = "stock-symbol"; // Class used for styling in CSS
    leftSpan.textContent = `${stock.symbol} – ${stock.name}`;

    // Create a <span> for the stock price (right side)
    const rightSpan = document.createElement("span");
    rightSpan.className = "stock-price"; // Class used for styling in CSS
    rightSpan.textContent = `$${stock.price.toFixed(2)}`;

    // Add both spans into the <li>
    li.appendChild(leftSpan);
    li.appendChild(rightSpan);

    // Add the <li> into the <ul id="stock-list">
    list.appendChild(li);
  });
}


// ==============================
// Run code when the page is ready
// ==============================

// This event fires when the HTML page has finished loading.
// At that point, we call renderPopularStocks so it can safely
// find the #stock-list element and fill it.
document.addEventListener("DOMContentLoaded", renderPopularStocks);
