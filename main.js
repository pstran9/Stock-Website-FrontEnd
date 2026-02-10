// ==============================
// CENTRAL STOCKS ARRAY - This is what both Market and Admin use
// ==============================
let stocks = []; // Start empty - admin will populate it

// ==============================
// POPULAR STOCKS - For other pages (home page stock list)
// ==============================
const popularStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 193.12 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 415.27 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 152.04 }
];

// DOM elements (grab once, reuse everywhere)
const elements = {
    tableBody: document.getElementById("stockTable")?.querySelector("tbody"),
    adminTableBody: document.getElementById("adminTableBody"),
    searchInput: document.getElementById("searchInput"),
    sectorFilter: document.getElementById("sectorFilter"),
    adminSearch: document.getElementById("adminSearch"),
    stockCount: document.getElementById("stockCount"),
    clearAllBtn: document.getElementById("clearAllBtn"),
    addStockForm: document.getElementById("addStockForm"),
    symbolInput: document.getElementById("symbolInput"),
    companyInput: document.getElementById("companyInput"),
    sectorInput: document.getElementById("sectorInput"),
    priceInput: document.getElementById("priceInput"),
    changeInput: document.getElementById("changeInput"),
    percentInput: document.getElementById("percentInput"),
    detailsPlaceholder: document.getElementById("detailsPlaceholder"),
    detailsCard: document.getElementById("stockDetails"),
    stockList: document.getElementById("stock-list"),
    contactForm: document.getElementById("contact-form"),
    confirmationMessage: document.getElementById("confirmation-message")
};

// ==============================
// RENDER POPULAR STOCKS (for home page)
// ==============================
function renderPopularStocks() {
    if (!elements.stockList) return;
    
    elements.stockList.innerHTML = "";
    
    popularStocks.forEach(stock => {
        const li = document.createElement("li");
        const leftSpan = document.createElement("span");
        leftSpan.className = "stock-symbol";
        leftSpan.textContent = `${stock.symbol} – ${stock.name}`;
        
        const rightSpan = document.createElement("span");
        rightSpan.className = "stock-price";
        rightSpan.textContent = `$${stock.price.toFixed(2)}`;
        
        li.appendChild(leftSpan);
        li.appendChild(rightSpan);
        elements.stockList.appendChild(li);
    });
}

// ==============================
// RENDER MARKET TABLE (for market.html)
// ==============================
function renderTable(data = stocks) {
    if (!elements.tableBody) return;
    
    elements.tableBody.innerHTML = "";
    
    data.forEach((stock) => {
        const row = document.createElement("tr");
        row.addEventListener("click", () => showDetails(stock));
        
        // Create all cells (same as before)
        const cells = [
            stock.symbol,
            stock.company,
            stock.sector,
            stock.price.toFixed(2),
            stock.change.toFixed(2),
            (stock.percentChange.toFixed(2) + "%")
        ];
        
        cells.forEach((content, i) => {
            const td = document.createElement("td");
            if (i >= 4) { // change/percent columns
                const value = i === 4 ? stock.change : stock.percentChange;
                td.className = value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral';
            }
            td.textContent = content;
            row.appendChild(td);
        });
        
        // Actions
        const actionsTd = document.createElement("td");
        actionsTd.className = "actions-cell";
        actionsTd.innerHTML = `
            <button class="btn btn-buy" onclick="event.stopPropagation(); handleBuy('${stock.symbol}')">Buy</button>
            <button class="btn btn-sell" onclick="event.stopPropagation(); handleSell('${stock.symbol}')">Sell</button>
        `;
        row.appendChild(actionsTd);
        
        elements.tableBody.appendChild(row);
    });
}

// ==============================
// RENDER ADMIN TABLE
// ==============================
function renderAdminTable(data = stocks) {
    if (!elements.adminTableBody) return;
    
    elements.adminTableBody.innerHTML = "";
    
    data.forEach((stock, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${stock.symbol}</strong></td>
            <td>${stock.company}</td>
            <td>${stock.sector}</td>
            <td>$${stock.price.toFixed(2)}</td>
            <td class="${stock.change > 0 ? 'positive' : stock.change < 0 ? 'negative' : 'neutral'}">
                ${stock.change.toFixed(2)}
            </td>
            <td class="${stock.percentChange > 0 ? 'positive' : stock.percentChange < 0 ? 'negative' : 'neutral'}">
                ${stock.percentChange.toFixed(2)}%
            </td>
            <td>
                <button class="btn-edit" onclick="editStock(${index})">Edit</button>
                <button class="btn-delete" onclick="deleteStock(${index})">Delete</button>
            </td>
        `;
        elements.adminTableBody.appendChild(row);
    });
}

// ==============================
// ADMIN FUNCTIONS
// ==============================
function updateStockCount() {
    if (elements.stockCount) {
        elements.stockCount.textContent = stocks.length;
    }
}

function deleteStock(index) {
    if (confirm(`Delete ${stocks[index].symbol}?`)) {
        stocks.splice(index, 1);
        renderAdminTable(stocks);
        updateStockCount();
        alert("Stock deleted!");
    }
}

function editStock(index) {
    const stock = stocks[index];
    if (elements.symbolInput) elements.symbolInput.value = stock.symbol;
    if (elements.companyInput) elements.companyInput.value = stock.company;
    if (elements.sectorInput) elements.sectorInput.value = stock.sector;
    if (elements.priceInput) elements.priceInput.value = stock.price;
    if (elements.changeInput) elements.changeInput.value = stock.change;
    if (elements.percentInput) elements.percentInput.value = stock.percentChange;
    
    if (elements.addStockForm) {
        elements.addStockForm.querySelector('button[type="submit"]').textContent = "Update Stock";
        elements.addStockForm.dataset.editingIndex = index;
    }
}

function initAdminForm() {
    if (!elements.addStockForm) return;
    
    elements.addStockForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const editingIndex = elements.addStockForm.dataset.editingIndex;
        
        // Validate all fields exist
        if (!elements.symbolInput?.value || !elements.companyInput?.value || 
            !elements.sectorInput?.value || !elements.priceInput?.value || 
            !elements.changeInput?.value || !elements.percentInput?.value) {
            alert("Please fill in all fields.");
            return;
        }
        
        const stockData = {
            symbol: elements.symbolInput.value.toUpperCase(),
            company: elements.companyInput.value,
            sector: elements.sectorInput.value,
            price: parseFloat(elements.priceInput.value),
            change: parseFloat(elements.changeInput.value),
            percentChange: parseFloat(elements.percentInput.value)
        };
        
        if (editingIndex) {
            stocks[editingIndex] = stockData;
            delete elements.addStockForm.dataset.editingIndex;
            elements.addStockForm.querySelector('button[type="submit"]').textContent = "Add Stock";
            alert("Stock updated!");
        } else {
            stocks.push(stockData);
            alert("Stock added!");
        }
        
        renderAdminTable(stocks);
        updateStockCount();
        elements.addStockForm.reset();
    });
}

// ==============================
// MARKET PAGE FUNCTIONS (search/filter)
// ==============================
function applyFilters() {
    const searchText = (elements.searchInput?.value || "").trim().toLowerCase();
    const sector = elements.sectorFilter?.value || "all";
    
    const filtered = stocks.filter(stock => 
        (sector === "all" || stock.sector === sector) &&
        (stock.symbol.toLowerCase().includes(searchText) || 
         stock.company.toLowerCase().includes(searchText))
    );
    
    renderTable(filtered);
}

function handleBuy(symbol) { alert(`Buy order for ${symbol}`); }
function handleSell(symbol) { alert(`Sell order for ${symbol}`); }
function showDetails(stock) {
    // Details panel logic for market page
    if (elements.detailsPlaceholder) elements.detailsPlaceholder.classList.add("hidden");
    if (elements.detailsCard) elements.detailsCard.classList.remove("hidden");
}

// ==============================
// CONTACT FORM
// ==============================
function initContactForm() {
    if (!elements.contactForm || !elements.confirmationMessage) return;
    
    elements.contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        elements.contactForm.reset();
        elements.confirmationMessage.style.display = "block";
        setTimeout(() => elements.confirmationMessage.style.display = "none", 5000);
    });
}

// ==============================
// SINGLE INITIALIZATION - Everything starts here
// ==============================
document.addEventListener("DOMContentLoaded", () => {
    renderPopularStocks();  // Home page stocks
    renderTable();          // Market page table  
    renderAdminTable();     // Admin page table
    updateStockCount();     // Admin counter
    
    initAdminForm();        // Admin form
    initContactForm();      // Contact form
    
    // Event listeners
    if (elements.searchInput) elements.searchInput.addEventListener("input", applyFilters);
    if (elements.sectorFilter) elements.sectorFilter.addEventListener("change", applyFilters);
    if (elements.adminSearch) {
        elements.adminSearch.addEventListener("input", () => {
            const text = elements.adminSearch.value.trim().toLowerCase();
            const filtered = stocks.filter(s => 
                s.symbol.toLowerCase().includes(text) || s.company.toLowerCase().includes(text)
            );
            renderAdminTable(filtered);
        });
    }
    if (elements.clearAllBtn) {
        elements.clearAllBtn.addEventListener("click", () => {
            if (confirm("Delete ALL stocks?")) {
                stocks = [];
                renderAdminTable([]);
                renderTable([]);
                updateStockCount();
            }
        });
    }
});
