//////////////////////////////////////////////////////////////
//                  Global Variables                        //
//////////////////////////////////////////////////////////////f

// Button Queries
var editStockButton = document.querySelector("#stock-edit-btn");
var stockConfirmEl = document.querySelector("#stock-confirm-btn");
var closeStockButtonEl = document.querySelector("#stock-close-btn");
var stockXButtonEl = document.querySelector("#stock-close");
var stockRemoveEl = document.querySelector("#stock-remove-btn");

// Eventlisteners
editStockButton.addEventListener("click", editStockAlerts);
stockConfirmEl.addEventListener("click", confirmStockEdits);
closeStockButtonEl.addEventListener("click", closeStockEdit);
stockXButtonEl.addEventListener("click", closeStockEdit);
stockRemoveEl.addEventListener("click", removeStock);

// API URLs and API keys
var urlKeyStockAlphaAdvantage    = "&apikey=XMDSSBDY4JYPVPPD";
var apiStockParamsUrl       = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=";

var urlKeyFinnhub           = "&token=btdd1gf48v6t4umjmegg";
var apiFinnhubStockPriceUrl = "https://finnhub.io/api/v1/quote?symbol=";

//////////////////////////////////////////////////////////////
//                  Stock Search Functions                  //
//////////////////////////////////////////////////////////////

// Search function to be called when search button is pressed.
function searchStock()
{
    // Take value from searchbar textcontent
    var stockVal = document.querySelector("#stock-search").value.toUpperCase();

    // Make sure the entered ticker is not a duplicate of one already defined.
    var duplicate = checkForDuplicateStocks( stockVal );
    if( duplicate ) 
    {
        return;
    }

    // Search for stock data
    getStockParameters(stockVal);

    // Save function
    saveInvestments();
}

// Function to search for a duplicate stock ticker
checkForDuplicateStocks = function( stockVal ) 
{
    for( var i = 0; i < stock.length; i++ ) 
    {
        if( stock[i].symbol === stockVal ) 
        {
            // Clear stock search bar
            document.querySelector("#stock-search").value = "";
            return true;
        }
    }
    return false;
}

// Function to acquire the current data for a specified stock
var getStockParameters = function (stockSymbol) 
{
    stockValues = 
    {
        name : "",
        symbol : "",
        exchange : "",
        price: "",
        priceMin: "",
        priceMax: "",
        eps : "",
        epsMin : "",
        epsMax : "",
        beta : "",
        betaMin : "",
        betaMax : "",
        pe : "",
        peMin : "",
        peMax : "",
        target : "",
        targetMin : "",
        targetMax : "",
        f50Avg : "",
        f50AvgMin : "",
        f50AvgMax : "",
        t200Avg : "",
        t200AvgMin : "",
        t200AvgMax : ""
    };

    finalUrl = apiStockParamsUrl + stockSymbol + urlKeyStockAlphaAdvantage;
    // Make the request for the stock's data
    fetch(finalUrl).then(function (response) 
    {
        return response.json();
    }).then(function (response)
    {
        // Verify that data was acquired
        if (!response.Name)
        {
            throw "Error: Symbol not found.";
        }

        // Put the stock's data in the return variables.
        stockValues.symbol   = stockSymbol;
        stockValues.exchange = response.Exchange;
        stockValues.eps      = response.EPS;
        stockValues.beta     = response.Beta;
        stockValues.pe       = response.PERatio;
        stockValues.name     = response.Name;
        stockValues.target   = response.AnalystTargetPrice;
        stockValues.f50Avg   = response["50DayMovingAverage"];
        stockValues.t200Avg  = response["200DayMovingAverage"];

        return true;
    }).then(function() 
    {
        // Construct the finished URL to obtain the current stock price.
        var finalUrl = apiFinnhubStockPriceUrl + stockSymbol + urlKeyFinnhub;

        // Make the request for the stock's price
        fetch(finalUrl).then(function(response) 
        {
            return response.json();
        }).then(function(response) 
        {
            // Verify that data was acquired
            if (!response.c)
            {
                console.log("error");
                return false;
            }
    
            // Put the stock's price data in the return variable.
            stockValues.price = response.c;
    
            // Update the HTML page with this value
            // dataVal = document.querySelector("#stock-price .current");
            // dataVal.textContent = response.c;

            stock.push(stockValues);
            

            // Update the HTML page with these values
            // showOneStock(stock.length - 1);

            updateStockTable();
            saveInvestments();

            return true;
        });
    }).catch(function (error) 
    {
        // Notice this `.catch()` is chained onto the end of the `.then()` method
        // alert("Unable to connect to AlphaAdvantage for stock data.");
        console.log(error);
        invalidStock();
        return;
    });
}

// Function to update the data for the stock at the specified index.
var updateStockParameters = function (index) 
{
    // Get the stock symbol from the array.
    var stockSymbol = stock[index].symbol;

    // Construct the finished URL to obtain the current stock price.
    var finalUrl = apiFinnhubStockPriceUrl + stockSymbol + urlKeyFinnhub;

    // Make the request for the stock's price
    fetch(finalUrl).then(function (response) 
    {
        return response.json();

    }).then(function (response) 
    {
        console.log(response);
        // Verify that data was acquired
        if (!response.c) {
            console.log("error");
            return false;
        }

        // Put the stock's updated price data in the array.
        stock[index].price = response.c;

        return true;

    }).then(function () 
    {
        // Construct the finished URL to obtain the market index values 
        finalUrl = apiMarketIndexUrl + urlKeyFinancialModeling;

        // Make the request for the stock's data
        fetch(finalUrl).then(function (response) {
            return response.json();

        }).then(function (response) {
            // Verify that data was acquired
            if (response.cod == 404) {
                returnValue = -1;
                return (returnValue);
            }

            // Get the index values and put them in the return variables.
            indexes[0] = response[7].price;     // S&P 500
            indexes[1] = response[19].price;    // NASDAQ
            indexes[2] = response[12].price;    // NYSE
            indexes[3] = response[31].price;    // DOW

            // Update the HTML page with these values
            showEquityIndexes(index);

            return;

        }).then(function (response) 
        {
            // Check the "dailyCheck" flag, so the basic stock parameters
            // are only checked once a day - since they won't be changed 
            // until after the market closes.

            if (dailyCheckStocks)
            {
                saveInvestments();
                return;
            }

            finalUrl = apiStockParamsUrl + stockSymbol + urlKeyStockAlphaAdvantage;

            // Make the request for the stock's data (updated daily)
            fetch(finalUrl).then(function (response) 
            {
                return response.json();
            }).then(function (response) 
            {
                // Verify that data was acquired
                if (!response.Name) 
                {
                    throw "Error: Symbol not found.";
                }
                stock[index].eps     = response.EPS;
                stock[index].beta    = response.Beta;
                stock[index].pe      = response.PERatio;
                stock[index].target  = response.AnalystTargetPrice;
                stock[index].f50Avg  = response["50DayMovingAverage"];
                stock[index].t200Avg = response["200DayMovingAverage"];

                // Reset the "dailyCheck" flag, so this is only done once.
                dailyCheckStocks = true;

                // This save is necessary because we updated the stock parameters.
                saveInvestments();

                return true;
            })
        })
    }).catch(function (error) 
    {
        console.log(error);
        invalidStock();
        return;
    });
}

//////////////////////////////////////////////////////////////
//               Stock Search Error Functions               //
//////////////////////////////////////////////////////////////

// Open Error Modal and clears stock-search element
function invalidStock()
{
    // Clear stock search bar
    document.querySelector("#stock-search").value = "";

    // Query for error modal
    var errorModalEl = document.querySelector("#error-modal");

    // Set modal to active
    errorModalEl.classList.add("is-active");
}


//////////////////////////////////////////////////////////////
//              Stock Table Update Functions                //
//////////////////////////////////////////////////////////////

// Update all stock tables and the stock select menu
function updateStockTable()
{
    // Get general stock table element.
    var generalStockTableEl = document.querySelector("#general-stock-table");

    // Clear table.
    generalStockTableEl.innerHTML = "";

    // Add title row to table.
    var titleRowEl = document.createElement("tr");
    var titleEl = document.createElement("th");
    titleEl.setAttribute("colspan","3");
    titleEl.classList.add("has-text-centered");
    titleEl.textContent = "Equities";
    titleRowEl.appendChild(titleEl);
    generalStockTableEl.appendChild(titleRowEl);

    // Add header row to table.
    var headerRowEl = document.createElement("tr");
    var nameHeaderEl = document.createElement("th");
    nameHeaderEl.textContent = "Name";
    headerRowEl.appendChild(nameHeaderEl);
    var symbolHeaderEl = document.createElement("th");
    symbolHeaderEl.textContent = "Symbol";
    headerRowEl.appendChild(symbolHeaderEl);
    var alertHeaderEl = document.createElement("th");
    alertHeaderEl.textContent = "Alert";
    headerRowEl.appendChild(alertHeaderEl);
    generalStockTableEl.appendChild(headerRowEl);
    
    // Clear select menu
    var selectMenuEl = document.querySelector("#select-stock-list");
    selectMenuEl.innerHTML = "";

    // Add default select item
    var defaultSelectEl = document.createElement("option");
    defaultSelectEl.value = "";
    defaultSelectEl.text = "Watched Stocks";
    defaultSelectEl.setAttribute("selected", true);
    defaultSelectEl.setAttribute("hidden", true);
    defaultSelectEl.setAttribute("disabled", true);

    selectMenuEl.appendChild(defaultSelectEl);

    // Add item for when no stocks are present.
    if(stock.length === 0)
    {
        var selectItemEl = document.createElement("option");
        selectItemEl.value = "";
        selectItemEl.text = "No stocks found.";
        selectItemEl.setAttribute("disabled", true);

        selectMenuEl.appendChild(selectItemEl);
    }

    // Hide stock info
    var stockInfoEl = document.querySelector("#select-stock");
    if(!stockInfoEl.classList.contains("hidden"))
    {
        stockInfoEl.classList.add("hidden");
    }

    // Add data for each stock.
    stock.forEach(function(value, index)
    {
        var dataRowEl = document.createElement("tr");
        var nameEl = document.createElement("td");
        var symbolEl = document.createElement("td");
        var alertEl = document.createElement("td");

        nameEl.textContent = value.name;
        symbolEl.textContent = value.symbol;
        // Add in alert data

        dataRowEl.appendChild(nameEl);
        dataRowEl.appendChild(symbolEl);
        dataRowEl.appendChild(alertEl);
        
        generalStockTableEl.appendChild(dataRowEl);

        // Add option to select menu.
        var selectItemEl = document.createElement("option");
        selectItemEl.value = index;
        selectItemEl.text = value.name;

        selectMenuEl.appendChild(selectItemEl);
    });

    if(stock.length < 5)
    {
        var searchRowEl = document.createElement("tr");

        var searchEl = document.createElement("td");
        searchEl.setAttribute("colspan", "3");

        var searchContainerEl = document.createElement("div");
        searchContainerEl.classList.add("field", "is-grouped");

        var inputContainerEl = document.createElement("p");
        inputContainerEl.classList.add("control", "is-expanded");
        var inputEl = document.createElement("input");
        inputEl.classList.add("input");
        inputEl.setAttribute("type", "text");
        inputEl.setAttribute("placeholder", "Enter stock symbol");
        inputEl.id = "stock-search";
        inputContainerEl.appendChild(inputEl);
        searchContainerEl.appendChild(inputContainerEl);

        var btnContainerEl = document.createElement("p");
        btnContainerEl.classList.add("control");
        var btnEl = document.createElement("a");
        btnEl.classList.add("button", "is-info");
        btnEl.id = "stock-search-btn";
        btnEl.textContent = "Search";
        btnEl.addEventListener("click", searchStock);
        btnContainerEl.appendChild(btnEl);
        searchContainerEl.appendChild(btnContainerEl);

        searchEl.appendChild(searchContainerEl);
        searchRowEl.appendChild(searchEl);

        generalStockTableEl.appendChild(searchRowEl);
    }
    saveInvestments();
}

// Function to be called when select menu is changed
function updateMainStock()
{
    var selectStockEl = document.querySelector("#select-stock-list");
    showOneStock(selectStockEl.value);
}

// Function to display the data on a single stock.
var showOneStock = function( index ) {

    // Query and display stock-info.
    var stockInfoEl = document.querySelector("#select-stock");
    if(stockInfoEl.classList.contains("hidden"))
    {
        stockInfoEl.classList.remove("hidden");
    }

    // Display the price data of the stock
    var dataVal = document.querySelector("#stock-price .current");
    dataVal.textContent = parseFloat(stock[index].price).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-price-modal");
    dataVal.textContent = parseFloat(stock[index].price).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    if(stock[index].priceMin !== "")
    {
        dataVal = document.querySelector("#stock-price .min");
        dataVal.textContent = parseFloat(stock[index].priceMin).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    }
    if(stock[index].priceMax !== "")
    {
        dataVal = document.querySelector("#stock-price .max");
        dataVal.textContent = parseFloat(stock[index].priceMax).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    }
    checkSymbol = verifyInvestmentItem( stock[index].price, stock[index].priceMin, stock[index].priceMax );
    dataVal = document.querySelector("#stock-price .alert");
    dataVal.textContent = checkSymbol;

    // display the eps data of the stock
    dataVal = document.querySelector("#stock-eps .current");
    dataVal.textContent = parseFloat(stock[index].eps).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-eps-modal");
    dataVal.textContent = parseFloat(stock[index].eps).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    if(stock[index].epsMin !== "")
    {    
        dataVal = document.querySelector("#stock-eps .min");
        dataVal.textContent = parseFloat(stock[index].epsMin).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    }
    if(stock[index].epsMax !== "")
    {    
        dataVal = document.querySelector("#stock-eps .max");
        dataVal.textContent = parseFloat(stock[index].epsMax).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});;
    }    
    checkSymbol = verifyInvestmentItem( stock[index].eps, stock[index].epsMin, stock[index].epsMax );
    dataVal = document.querySelector("#stock-eps .alert");
    dataVal.textContent = checkSymbol;

    // display the beta data of the stock
    dataVal = document.querySelector("#stock-beta .current");
    dataVal.textContent = stock[index].beta;
    dataVal = document.querySelector("#stock-beta-modal");
    dataVal.textContent = stock[index].beta;
    if(stock[index].betaMin !== "")
    {
        dataVal = document.querySelector("#stock-beta .min");
        dataVal.textContent = stock[index].betaMin;
    }
    if(stock[index].betaMax !== "")
    {
        dataVal = document.querySelector("#stock-beta .max");
        dataVal.textContent = stock[index].betaMax;
    }    
    checkSymbol = verifyInvestmentItem( stock[index].beta, stock[index].betaMin, stock[index].betaMax );
    dataVal = document.querySelector("#stock-beta .alert");
    dataVal.textContent = checkSymbol;

    // display the per data of the stock
    dataVal = document.querySelector("#stock-per .current");
    dataVal.textContent = stock[index].pe;
    dataVal = document.querySelector("#stock-per-modal");
    dataVal.textContent = stock[index].pe;
    if(stock[index].peMin !== "")
    {
        dataVal = document.querySelector("#stock-per .min");
        dataVal.textContent = stock[index].peMin;
    }
    if(stock[index].peMax !== "")
    {
        dataVal = document.querySelector("#stock-per .max");
        dataVal.textContent = stock[index].peMax;
    }    
    checkSymbol = verifyInvestmentItem( stock[index].pe, stock[index].peMin, stock[index].peMax );
    dataVal = document.querySelector("#stock-per .alert");
    dataVal.textContent = checkSymbol;

    // display the target data of the stock
    dataVal = document.querySelector("#stock-target .current");
    dataVal.textContent = parseFloat(stock[index].target).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-target-modal");
    dataVal.textContent = parseFloat(stock[index].target).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    if(stock[index].targetMin !== "")
    {    
        dataVal = document.querySelector("#stock-target .min");
        dataVal.textContent = parseFloat(stock[index].targetMin).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    }    
    if(stock[index].targetMax !== "")
    {
        dataVal = document.querySelector("#stock-target .max");
        dataVal.textContent = parseFloat(stock[index].targetMax).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    }    
    checkSymbol = verifyInvestmentItem( stock[index].target, stock[index].targetMin, stock[index].targetMax );
    dataVal = document.querySelector("#stock-target .alert");
    dataVal.textContent = checkSymbol;

    // display the 50day avg data of the stock
    dataVal = document.querySelector("#stock-50avg .current");
    dataVal.textContent = parseFloat(stock[index].f50Avg).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-50avg-modal");
    dataVal.textContent = parseFloat(stock[index].f50Avg).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    if(stock[index].f50AvgMin !== "")
    {
        dataVal = document.querySelector("#stock-50avg .min");
        dataVal.textContent = parseFloat(stock[index].f50AvgMin).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    }    
    if(stock[index].f50AvgMax !== "")
    {
        dataVal = document.querySelector("#stock-50avg .max");
        dataVal.textContent = parseFloat(stock[index].f50AvgMax).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    }    
    checkSymbol = verifyInvestmentItem( stock[index].f50Avg, stock[index].f50AvgMin, stock[index].f50AvgMax );
    dataVal = document.querySelector("#stock-50avg .alert");
    dataVal.textContent = checkSymbol;

    // display the 200 day avg data of the stock
    dataVal = document.querySelector("#stock-200avg .current");
    dataVal.textContent = parseFloat(stock[index].t200Avg).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-200avg-modal");
    dataVal.textContent = parseFloat(stock[index].t200Avg).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    if(stock[index].t200AvgMin !== "")
    {
        dataVal = document.querySelector("#stock-200avg .min");
        dataVal.textContent = parseFloat(stock[index].t200AvgMin).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    }
    if(stock[index].t200AvgMax !== "")
    {
        dataVal = document.querySelector("#stock-200avg .max");
        dataVal.textContent = parseFloat(stock[index].t200AvgMax).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    }    
    checkSymbol = verifyInvestmentItem( stock[index].t200Avg, stock[index].t200AvgMin, stock[index].t200AvgMax );
    dataVal = document.querySelector("#stock-200avg .alert");
    dataVal.textContent = checkSymbol;

    // display the basic info of the stock
    dataVal = document.querySelector( "#stock-name" );
    dataVal.textContent = stock[index].name; 
    dataVal = document.querySelector( "#stock-symbol" );
    dataVal.textContent = stock[index].symbol;
    dataVal = document.querySelector( "#stock-exchange" );
    dataVal.textContent = stock[index].exchange;
}

// Remove current stock
function removeStock()
{
    // Get list index of active stock element
    var index = document.querySelector("#select-stock-list").value;

    // Remove element from list.
    stock.splice(index, 1);

    // Update table and hide it
    updateStockTable();
}

//////////////////////////////////////////////////////////////
//                  Edit Modal Functions                    //
//////////////////////////////////////////////////////////////

// Open modal to edit stock ranges
function editStockAlerts()
{
    var stockModalEl = $("#stock-edit-modal");
    stockModalEl.addClass("is-active");
}

// Apply changes from stock edit ranges modal
function confirmStockEdits()
{
    // Get list index of active stock element
    var index = document.querySelector("#select-stock-list").value;

    // Update pricemin and pricemax
    var stockEl = document.querySelector("#stock-price-input");
    if(stockEl.parentElement.querySelector(".min").value)
    {
        stock[index].priceMin = stockEl.querySelector(".min").value;
    }
    if(stockEl.querySelector(".max").value)
    {
        stock[index].priceMax = stockEl.querySelector(".max").value;
    }

    // Update targetmin and targetmax
    stockEl = document.querySelector("#stock-target-input");
    if(stockEl.querySelector(".min").value)
    {
        stock[index].targetMin = stockEl.querySelector(".min").value;
    }
    if(stockEl.querySelector(".max").value)
    {
        stock[index].targetMax = stockEl.querySelector(".max").value;
    }

    // Update epsmin and epsmax
    stockEl = document.querySelector("#stock-eps-input");
    if(stockEl.querySelector(".min").value)
    {
        stock[index].epsMin = stockEl.querySelector(".min").value;
    }
    if(stockEl.querySelector(".max").value)
    {
        stock[index].epsMax = stockEl.querySelector(".max").value;
    }

    // Update permin and permax
    stockEl = document.querySelector("#stock-per-input");
    if(stockEl.querySelector(".min").value)
    {
        stock[index].peMin = stockEl.querySelector(".min").value;
    }
    if(stockEl.querySelector(".max").value)
    {
        stock[index].peMax = stockEl.querySelector(".max").value;
    }

    // Update betamin and betamax
    stockEl = document.querySelector("#stock-beta-input");
    if(stockEl.querySelector(".min").value)
    {
        stock[index].betaMin = stockEl.querySelector(".min").value;
    }
    if(stockEl.querySelector(".max").value)
    {
        stock[index].betaMax = stockEl.querySelector(".max").value;
    }

    // Update 50avgmin and 50avgmax
    stockEl = document.querySelector("#stock-50avg-input");
    if(stockEl.querySelector(".min").value)
    {
        stock[index].f50AvgMin = stockEl.querySelector(".min").value;
    }
    if(stockEl.querySelector(".max").value)
    {
        stock[index].f50AvgMax = stockEl.querySelector(".max").value;
    }
    
    // Update 200avgmin and 200avgmax
    stockEl = document.querySelector("#stock-200avg-input");
    if(stockEl.querySelector(".min").value)
    {
        stock[index].t200AvgMin = stockEl.querySelector(".min").value;
    }
    if(stockEl.querySelector(".max").value)
    {
        stock[index].t200AvgMax = stockEl.querySelector(".max").value;
    }

    // Update stock table with values
    showOneStock(index);

    // Close modal
    closeStockEdit();
    saveInvestments();
}

// Close edit stock modal
function closeStockEdit()
{
    var stockModalEl = $("#stock-edit-modal");
    stockModalEl.removeClass("is-active");
}