//////////////////////////////////////////////////////////////
//                  Global Variables                        //
//////////////////////////////////////////////////////////////

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
        alert : errorIcon,
        price: "",
        priceMin: "",
        priceMax: "",
        priceAlert: errorIcon,
        eps : "",
        epsMin : "",
        epsMax : "",
        epsAlert: errorIcon,
        beta : "",
        betaMin : "",
        betaMax : "",
        betaAlert : errorIcon,
        pe : "",
        peMin : "",
        peMax : "",
        peAlert : errorIcon,
        target : "",
        targetMin : "",
        targetMax : "",
        targetAlert : errorIcon,
        f50Avg : "",
        f50AvgMin : "",
        f50AvgMax : "",
        f50AvgAlert : errorIcon,
        t200Avg : "",
        t200AvgMin : "",
        t200AvgMax : "", 
        t200AvgAlert : errorIcon
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
        console.log(response);
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
    }).then(function()
    {
        if(document.querySelector("#select-stock-list").value !== "")
        {
            showOneStock(document.querySelector("#select-stock-list").value);
        }
        updateStockAlerts();
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
        alertEl.classList.add("has-text-centered");
        alertEl.innerHTML = value.alert;
        alertEl.id = "stock-alert-" + index;
        // Add in alert data

        dataRowEl.appendChild(nameEl);
        dataRowEl.appendChild(symbolEl);
        dataRowEl.appendChild(alertEl);
        
        generalStockTableEl.appendChild(dataRowEl);
        console.log(document.querySelector("#stock-alert-"+index));

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
    dataVal = document.querySelector("#stock-price .min");
    if(stock[index].priceMin !== "")
    {
        dataVal.textContent = parseFloat(stock[index].priceMin).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    }
    else
    {
        dataVal.textContent = "";
    }
    dataVal = document.querySelector("#stock-price .max");
    if(stock[index].priceMax !== "")
    {
        dataVal.textContent = parseFloat(stock[index].priceMax).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    }
    else
    {
        dataVal.textContent = "";
    }
    checkSymbol = verifyInvestmentItem( stock[index].price, stock[index].priceMin, stock[index].priceMax );
    stock[index].priceAlert = checkSymbol;
    dataVal = document.querySelector("#stock-price .alert");
    dataVal.innerHTML = checkSymbol;

    // display the eps data of the stock
    dataVal = document.querySelector("#stock-eps .current");
    dataVal.textContent = parseFloat(stock[index].eps).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-eps-modal");
    dataVal.textContent = parseFloat(stock[index].eps).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-eps .min");
    if(stock[index].epsMin !== "")
    {    
        dataVal.textContent = parseFloat(stock[index].epsMin).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    }
    else
    {
        dataVal.textContent = "";
    }
    dataVal = document.querySelector("#stock-eps .max");
    if(stock[index].epsMax !== "")
    {    
        dataVal.textContent = parseFloat(stock[index].epsMax).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});;
    }    
    else
    {
        dataVal.textContent = "";
    }
    checkSymbol = verifyInvestmentItem( stock[index].eps, stock[index].epsMin, stock[index].epsMax );
    stock[index].epsAlert = checkSymbol;
    dataVal = document.querySelector("#stock-eps .alert");
    dataVal.innerHTML = checkSymbol;

    // display the beta data of the stock
    dataVal = document.querySelector("#stock-beta .current");
    dataVal.textContent = stock[index].beta;
    dataVal = document.querySelector("#stock-beta-modal");
    dataVal.textContent = stock[index].beta;
    dataVal = document.querySelector("#stock-beta .min");
    if(stock[index].betaMin !== "")
    {
        dataVal.textContent = stock[index].betaMin;
    }
    else
    {
        dataVal.textContent = "";
    }
    dataVal = document.querySelector("#stock-beta .max");
    if(stock[index].betaMax !== "")
    {
        dataVal.textContent = stock[index].betaMax;
    }    
    else
    {
        dataVal.textContent = "";
    }
    checkSymbol = verifyInvestmentItem( stock[index].beta, stock[index].betaMin, stock[index].betaMax );
    stock[index].betaAlert = checkSymbol;
    dataVal = document.querySelector("#stock-beta .alert");
    dataVal.innerHTML = checkSymbol;

    // display the per data of the stock
    dataVal = document.querySelector("#stock-per .current");
    dataVal.textContent = stock[index].pe;
    dataVal = document.querySelector("#stock-per-modal");
    dataVal.textContent = stock[index].pe;
    dataVal = document.querySelector("#stock-per .min");
    if(stock[index].peMin !== "")
    {
        dataVal.textContent = stock[index].peMin;
    }
    else
    {
        dataVal.textContent = "";
    }
    dataVal = document.querySelector("#stock-per .max");
    if(stock[index].peMax !== "")
    {
        dataVal.textContent = stock[index].peMax;
    }    
    else
    {
        dataVal.textContent = "";
    }
    checkSymbol = verifyInvestmentItem( stock[index].pe, stock[index].peMin, stock[index].peMax );
    stock[index].peAlert = checkSymbol;
    dataVal = document.querySelector("#stock-per .alert");
    dataVal.innerHTML = checkSymbol;

    // display the target data of the stock
    dataVal = document.querySelector("#stock-target .current");
    dataVal.textContent = parseFloat(stock[index].target).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-target-modal");
    dataVal.textContent = parseFloat(stock[index].target).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-target .min");
    if(stock[index].targetMin !== "")
    {    
        dataVal.textContent = parseFloat(stock[index].targetMin).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    }    
    else
    {
        dataVal.textContent = "";
    }
    dataVal = document.querySelector("#stock-target .max");
    if(stock[index].targetMax !== "")
    {
        dataVal.textContent = parseFloat(stock[index].targetMax).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    }    
    else
    {
        dataVal.textContent = "";
    }
    checkSymbol = verifyInvestmentItem( stock[index].target, stock[index].targetMin, stock[index].targetMax );
    stock[index].targetAlert = checkSymbol;
    dataVal = document.querySelector("#stock-target .alert");
    dataVal.innerHTML = checkSymbol;

    // display the 50day avg data of the stock
    dataVal = document.querySelector("#stock-50avg .current");
    dataVal.textContent = parseFloat(stock[index].f50Avg).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-50avg-modal");
    dataVal.textContent = parseFloat(stock[index].f50Avg).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-50avg .min");
    if(stock[index].f50AvgMin !== "")
    {
        dataVal.textContent = parseFloat(stock[index].f50AvgMin).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    }    
    else
    {
        dataVal.textContent = "";
    }
    dataVal = document.querySelector("#stock-50avg .max");
    if(stock[index].f50AvgMax !== "")
    {
        dataVal.textContent = parseFloat(stock[index].f50AvgMax).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    }    
    else
    {
        dataVal.textContent = "";
    }
    checkSymbol = verifyInvestmentItem( stock[index].f50Avg, stock[index].f50AvgMin, stock[index].f50AvgMax );
    stock[index].f50AvgAlert = checkSymbol;
    dataVal = document.querySelector("#stock-50avg .alert");
    dataVal.innerHTML = checkSymbol;

    // display the 200 day avg data of the stock
    dataVal = document.querySelector("#stock-200avg .current");
    dataVal.textContent = parseFloat(stock[index].t200Avg).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-200avg-modal");
    dataVal.textContent = parseFloat(stock[index].t200Avg).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    dataVal = document.querySelector("#stock-200avg .min");
    if(stock[index].t200AvgMin !== "")
    {
        dataVal.textContent = parseFloat(stock[index].t200AvgMin).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    }
    else
    {
        dataVal.textContent = "";
    }
    dataVal = document.querySelector("#stock-200avg .max");
    if(stock[index].t200AvgMax !== "")
    {
        dataVal.textContent = parseFloat(stock[index].t200AvgMax).toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    }    
    else
    {
        dataVal.textContent = "";
    }
    checkSymbol = verifyInvestmentItem( stock[index].t200Avg, stock[index].t200AvgMin, stock[index].t200AvgMax );
    stock[index].t200AvgAlert = checkSymbol;
    dataVal = document.querySelector("#stock-200avg .alert");
    dataVal.innerHTML = checkSymbol;

    // display the basic info of the stock
    dataVal = document.querySelector( "#stock-name" );
    dataVal.textContent = stock[index].name; 
    dataVal = document.querySelector( "#stock-symbol" );
    dataVal.textContent = stock[index].symbol;
    dataVal = document.querySelector( "#stock-exchange" );
    dataVal.textContent = stock[index].exchange;
}

// Updates all alerts
function updateStockAlerts()
{
    var playAlert = false;
    stock.forEach(function(value, index)
    {
        var alerts = [];
        value.priceAlert = verifyInvestmentItem(value.price, value.priceMin, value.priceMax);
        alerts.push(value.priceAlert);
        console.log("priceAlert:", value.price, value.priceMin, value.priceMax, value.priceAlert);
        value.targetAlert = verifyInvestmentItem(value.target, value.targetMin, value.targetMax);
        alerts.push(value.targetAlert);
        value.epsAlert = verifyInvestmentItem(value.eps, value.epsMin, value.epsMax);
        alerts.push(value.epsAlert);
        value.peAlert = verifyInvestmentItem(value.pe, value.peMin, value.peMax);
        alerts.push(value.peAlert);
        value.betaAlert = verifyInvestmentItem(value.beta, value.betaMin, value.betaMax);
        alerts.push(value.betaAlert);
        value.f50AvgAlert = verifyInvestmentItem(value.f50Avg, value.f50AvgMin, value.f50AvgMax);
        alerts.push(value.f50AvgAlert);
        value.t200AvgAlert = verifyInvestmentItem(value.t200Avg, value.t200AvgMin, value.t200AvgMax);
        alerts.push(value.t200AvgAlert);

        var prioritizedValue;
        alerts.forEach(function(symbol, index)
        {
            if(index === 0 || prioritizedValue === errorIcon)
            {
                prioritizedValue = symbol;
            }
            else if(prioritizedValue === checkIcon && symbol === alertIcon)
            {
                prioritizedValue = symbol;
            }
        });
        value.alert = prioritizedValue;
        if(prioritizedValue === alertIcon)
        {
            playAlert = true;
        }

        // Update general stock table only
        document.querySelector("#stock-alert-"+index).innerHTML = value.alert;
    });
    if(playAlert)
    {
        playSound();
    }
    saveInvestments();
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
    saveInvestments();
}

//////////////////////////////////////////////////////////////
//                  Edit Modal Functions                    //
//////////////////////////////////////////////////////////////

// Open modal to edit stock ranges
function editStockAlerts()
{
    // Get list index of active stock element
    var index = document.querySelector("#select-stock-list").value;
    console.log(index);

    // Populate input values, if they exist
    document.querySelector("#stock-price-input .min").value = stock[index].priceMin;
    document.querySelector("#stock-price-input .max").value = stock[index].priceMax;
    
    document.querySelector("#stock-target-input .min").value = stock[index].targetMin;
    document.querySelector("#stock-target-input .max").value = stock[index].targetMax;
    
    document.querySelector("#stock-eps-input .min").value = stock[index].epsMin;
    document.querySelector("#stock-eps-input .max").value = stock[index].epsMax;
    
    document.querySelector("#stock-per-input .min").value = stock[index].peMin;
    document.querySelector("#stock-per-input .max").value = stock[index].peMax;
    
    document.querySelector("#stock-beta-input .min").value = stock[index].betaMin;
    document.querySelector("#stock-beta-input .max").value = stock[index].betaMax;
    
    document.querySelector("#stock-50avg-input .min").value = stock[index].f50AvgMin;
    document.querySelector("#stock-50avg-input .max").value = stock[index].f50AvgMax;
    
    document.querySelector("#stock-200avg-input .min").value = stock[index].t200AvgMin;
    document.querySelector("#stock-200avg-input .max").value = stock[index].t200AvgMax;

    // Make edit modal visible
    var stockModalEl = document.querySelector("#stock-edit-modal");
    stockModalEl.classList.add("is-active");
}

// Apply changes from stock edit ranges modal
function confirmStockEdits()
{
    // Get list index of active stock element
    var index = document.querySelector("#select-stock-list").value;

    // Update pricemin and pricemax
    var stockEl = document.querySelector("#stock-price-input");
    if(stockEl.querySelector(".min").value  && !isNaN(stockEl.querySelector(".min").value))
    {
        stock[index].priceMin = parseFloat(stockEl.querySelector(".min").value);
    }
    if(stockEl.querySelector(".max").value  && !isNaN(stockEl.querySelector(".max").value))
    {
        stock[index].priceMax = parseFloat(stockEl.querySelector(".max").value);
    }
    stockEl.querySelector(".max").value = "";
    stockEl.querySelector(".min").value = "";

    // Update targetmin and targetmax
    stockEl = document.querySelector("#stock-target-input");
    if(stockEl.querySelector(".min").value  && !isNaN(parseFloat(stockEl.querySelector(".min").value)))
    {
        stock[index].targetMin = stockEl.querySelector(".min").value;
    }
    if(stockEl.querySelector(".max").value  && !isNaN(parseFloat(stockEl.querySelector(".max").value)))
    {
        stock[index].targetMax = stockEl.querySelector(".max").value;
    }
    stockEl.querySelector(".max").value = "";
    stockEl.querySelector(".min").value = "";

    // Update epsmin and epsmax
    stockEl = document.querySelector("#stock-eps-input");
    if(stockEl.querySelector(".min").value  && !isNaN(parseFloat(stockEl.querySelector(".min").value)))
    {
        stock[index].epsMin = stockEl.querySelector(".min").value;
    }
    if(stockEl.querySelector(".max").value  && !isNaN(parseFloat(stockEl.querySelector(".max").value)))
    {
        stock[index].epsMax = stockEl.querySelector(".max").value;
    }
    stockEl.querySelector(".max").value = "";
    stockEl.querySelector(".min").value = "";

    // Update permin and permax
    stockEl = document.querySelector("#stock-per-input");
    if(stockEl.querySelector(".min").value  && !isNaN(parseFloat(stockEl.querySelector(".min").value)))
    {
        stock[index].peMin = stockEl.querySelector(".min").value;
    }
    if(stockEl.querySelector(".max").value  && !isNaN(parseFloat(stockEl.querySelector(".max").value)))
    {
        stock[index].peMax = stockEl.querySelector(".max").value;
    }
    stockEl.querySelector(".max").value = "";
    stockEl.querySelector(".min").value = "";

    // Update betamin and betamax
    stockEl = document.querySelector("#stock-beta-input");
    if(stockEl.querySelector(".min").value  && !isNaN(parseFloat(stockEl.querySelector(".min").value)))
    {
        stock[index].betaMin = stockEl.querySelector(".min").value;
    }
    if(stockEl.querySelector(".max").value  && !isNaN(parseFloat(stockEl.querySelector(".max").value)))
    {
        stock[index].betaMax = stockEl.querySelector(".max").value;
    }
    stockEl.querySelector(".max").value = "";
    stockEl.querySelector(".min").value = "";

    // Update 50avgmin and 50avgmax
    stockEl = document.querySelector("#stock-50avg-input");
    if(stockEl.querySelector(".min").value  && !isNaN(parseFloat(stockEl.querySelector(".min").value)))
    {
        stock[index].f50AvgMin = stockEl.querySelector(".min").value;
    }
    if(stockEl.querySelector(".max").value  && !isNaN(parseFloat(stockEl.querySelector(".max").value)))
    {
        stock[index].f50AvgMax = stockEl.querySelector(".max").value;
    }
    stockEl.querySelector(".max").value = "";
    stockEl.querySelector(".min").value = "";
    
    // Update 200avgmin and 200avgmax
    stockEl = document.querySelector("#stock-200avg-input");
    if(stockEl.querySelector(".min").value  && !isNaN(parseFloat(stockEl.querySelector(".min").value)))
    {
        stock[index].t200AvgMin = stockEl.querySelector(".min").value;
    }
    if(stockEl.querySelector(".max").value  && !isNaN(parseFloat(stockEl.querySelector(".max").value)))
    {
        stock[index].t200AvgMax = stockEl.querySelector(".max").value;
    }
    stockEl.querySelector(".max").value = "";
    stockEl.querySelector(".min").value = "";

    // Update alert symbols
    updateStockAlerts();

    // Update stock table with values
    showOneStock(index);

    // Close modal
    closeStockEdit();
    saveInvestments();
}

// Close edit stock modal
function closeStockEdit()
{
    var stockModalEl = document.querySelector("#stock-edit-modal");
    stockModalEl.classList.remove("is-active");
}