
////////////////////////////////////////////////////////////////////////////
// Global Variable Definitions

var stock = [];
    // { name: "", symbol: "", exchange: "", priceMin: "", priceMax: "", price: "",
    //   targetMin: "", targetMax: "", target: "", epsMin: "", epsMax: "", eps: "", 
    //   peMin: "", peMax: "", pe: "", betaMin: "", betaMax: "", beta: "", f50AvgMin: "", 
    //   f50AvgMax: "", f50Avg: "", t200AvgMin: "", t200AvgMax: "", t200Avg: "", exchange: "" },

    //   { name: "", symbol: "", exchange: "", priceMin: "", priceMax: "", price: "",
    //   targetMin: "", targetMax: "", target: "", epsMin: "", epsMax: "", eps: "", 
    //   peMin: "", peMax: "", pe: "", betaMin: "", betaMax: "", beta: "", f50AvgMin: "", 
    //   f50AvgMax: "", f50Avg: "", t200AvgMin: "", t200AvgMax: "", t200Avg: "", exchange: "" },
      
    //   { name: "", symbol: "", exchange: "", priceMin: "", priceMax: "", price: "",
    //   targetMin: "", targetMax: "", target: "", epsMin: "", epsMax: "", eps: "", 
    //   peMin: "", peMax: "", pe: "", betaMin: "", betaMax: "", beta: "", f50AvgMin: "", 
    //   f50AvgMax: "", f50Avg: "", t200AvgMin: "", t200AvgMax: "", t200Avg: "", exchange: "" },
      
    //   { name: "", symbol: "", exchange: "", priceMin: "", priceMax: "", price: "",
    //   targetMin: "", targetMax: "", target: "", epsMin: "", epsMax: "", eps: "", 
    //   peMin: "", peMax: "", pe: "", betaMin: "", betaMax: "", beta: "", f50AvgMin: "", 
    //   f50AvgMax: "", f50Avg: "", t200AvgMin: "", t200AvgMax: "", t200Avg: "", exchange: "" },
      
    //   { name: "", symbol: "", exchange: "", priceMin: "", priceMax: "", price: "",
    //   targetMin: "", targetMax: "", target: "", epsMin: "", epsMax: "", eps: "", 
    //   peMin: "", peMax: "", pe: "", betaMin: "", betaMax: "", beta: "", f50AvgMin: "", 
    //   f50AvgMax: "", f50Avg: "", t200AvgMin: "", t200AvgMax: "", t200Avg: "", exchange: "" }    

var cryptos = [];
    // { marketCapMin: "", marketCapMax: "", marketCap: "", priceMin: "", priceMax: "", price: "", 
    // volumeMin: "", volumeMax: "", volume: "", supplyMin: "", supplyMax: "", supply: "" },
    // { marketCapMin: "", marketCapMax: "", marketCap: "", priceMin: "", priceMax: "", price: "", 
    // volumeMin: "", volumeMax: "", volume: "", supplyMin: "", supplyMax: "", supply: "" },
    // { marketCapMin: "", marketCapMax: "", marketCap: "", priceMin: "", priceMax: "", price: "", 
    // volumeMin: "", volumeMax: "", volume: "", supplyMin: "", supplyMax: "", supply: "" },
    // { marketCapMin: "", marketCapMax: "", marketCap: "", priceMin: "", priceMax: "", price: "", 
    // volumeMin: "", volumeMax: "", volume: "", supplyMin: "", supplyMax: "", supply: "" },
    // { marketCapMin: "", marketCapMax: "", marketCap: "", priceMin: "", priceMax: "", price: "", 
    // volumeMin: "", volumeMax: "", volume: "", supplyMin: "", supplyMax: "", supply: "" } ];



var indexes = [4];       // Indexes are: S&P, NASDAQ, NYSE, DOW

var stockSymbol;
var index;               // the index into the 'stock' array
var dailyCheckStocks;    // if "true", the daily parameters have been obtained, no need to request again.
var dailyCheckCyrptos;   // if "true", the daily parameters have been obtained, no need to request again.
var dataVal;             // generic data value.
var checkSymbol;         // symbol for the "alert" columns

// Tab button queries
var tabListEl = document.querySelector("#tab-list");
var activeTab = document.querySelector("#general-tab");

///////////////////////////////////////////////////////////////////////////
// API URLs
// Richard API key
var urlKeyStockAlphaAdvantage    = "&apikey=XMDSSBDY4JYPVPPD";
// Tony API key
// var urlKeyCryptoAlphaAdvantage   = "&apikey=T8LGL5SSSR9B2P9R";
var apiStockParamsUrl       = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=";
// No longer used
// var apiStockPriceUrl        = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=";
// var apiCryptoScoreUrl       = "https://www.alphavantage.co/query?function=CRYPTO_RATING&symbol=";

var urlKeyFinancialModeling = "a107f24e0f6aaac5f180293fa869cd10";
var apiMarketIndexUrl       = "https://financialmodelingprep.com/api/v3/quotes/index?apikey=";

var urlKeyFinnhub           = "&token=btdd1gf48v6t4umjmegg";
var apiFinnhubStockPriceUrl = "https://finnhub.io/api/v1/quote?symbol=";

var urlKeyNomics            = "25f6ac7783932e08f376ee60095ddd35";
var apiNomicsCryptoPrice    = "https://cors-anywhere.herokuapp.com/https://api.nomics.com/v1/currencies/ticker?key=";
// var apiNomicsCryptoPrice    = "https://api.nomics.com/v1/currencies/ticker?key=";
var apiNomicsIds            = "&ids=";
var apiNomicsInterval       = "&interval=1d&convert=USD";

///////////////////////////////////////////////////////////////////////////
// Function to acquire the current data for a specified stock
var getStockParameters = function (stockSymbol) 
{
    stockValues = 
    {
        name : "",
        symbol : "",
        exchange : "",
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

        stock.push(stockValues);

        // Update the HTML page with these values
        showOneStock(stock.length - 1);

        return true;
    }).then(function () 
    {
        // Reset the "dailyCheck" flag, so this is only done once.
        dailyCheckStocks = true;
        
        
        // Construct the finished URL to obtain the market index values (once only)
        finalUrl = apiMarketIndexUrl + urlKeyFinancialModeling;

        // Make the request for the stock's data
        fetch(finalUrl).then(function (response) 
        {
            return response.json();
        }).then(function (response) 
        {
            // Verify that data was acquired
            if (response.cod == 404) 
            {
                returnValue = -1;
                return (returnValue);
            }

            // Get the index values and put them in the return variables.
            indexes[0] = response[7].price;     // S&P 500
            indexes[1] = response[19].price;    // NASDAQ
            indexes[2] = response[12].price;    // NYSE
            indexes[3] = response[31].price;    // DOW

            // Update the HTML page with these values
            showEquityIndexes( index );

            updateStockTable();
            saveInvestments();

            return;
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
                console.log(response);
                // Verify that data was acquired
                if (!response.c)
                {
                    console.log("error");
                    return false;
                }
        
                // Put the stock's price data in the return variable.
                stockValues.price = response.c;
        
                // Update the HTML page with this value
                dataVal = document.querySelector("#stock-price .current");
                dataVal.textContent = response.c;
                
                return true;
            });
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

///////////////////////////////////////////////////////////////////////////
// Function to acquire the current data for a specified cryptocurrency
var getCryptoParameters = function (cryptoSymbol, index) {

    // Construct the finished URL to obtain the current cryptocurrency data.
    var finalUrl = apiNomicsCryptoPrice + urlKeyNomics + apiNomicsIds + cryptoSymbol + apiNomicsInterval;

    cryptoValues = 
    {
        name: "",
        symbol: "",
        price: "",
        priceMin: "",
        priceMax: "",
        volume: "",
        volumeMin: "",
        volumeMax: "",
        supply: "",
        supplyMin: "",
        supplyMax: "",
        marcap: "",
        marcapMin: "",
        marcapMax: ""
    };

    // Make the request for the currency's data
    fetch(finalUrl)
        .then(function (response) {

            return response.json();
        })
        .then(function (response) {
            console.log( "Crypto Data: ", response );

            // Verify that data was acquired
            if (response.cod == 404) {
                returnValue = -1;
                return (returnValue);
            }

            // Put the currency's  data in the return variables.
            cryptoValues.price     = response[0].price;
            cryptoValues.volume    = response[0].circulating_supply;
            cryptoValues.supply    = response[0].max_supply;
            cryptoValues.marketCap = response[0].market_cap;

            cryptos.push(cryptoValues);

            showOneCrypto( index );
            saveInvestments();

            return;
        })

        // .then(function () {

        //     // Construct the finished URL to obtain the currency's 'Asset Score'
        //     finalUrl = apiCryptoScoreUrl + cryptoSymbol + urlKeyCryptoAlphaAdvantage;

        //     // Make the request for the stock's data
        //     fetch(finalUrl)
        //         .then(function (response) {

        //             return response.json();
        //         })
        //         .then(function (response) {
        //             console.log(response);

        //             // Verify that data was acquired
        //             if (response.cod == 404) {
        //                 returnValue = -1;
        //                 return (returnValue);
        //             }

        //             // Put the currency's score in the return variables.  
        //             var scorePart1 = response["Crypto Rating (FCAS)"]["3. fcas rating"];
        //             var scorePart2 = response["Crypto Rating (FCAS)"]["4. fcas score"];
        //             cryptos[index].score  = scorePart1 + ", " + scorePart2; 
        //         })
        // })

    // .catch(function (error) {
    //     // Notice this `.catch()` is chained onto the end of the `.then()` method
    //     alert("Unable to connect to Nomics for crypto data.");
    //     returnValue = -1;
    //     return (returnValue);
    // });

}



//////////////////////////////////////////////////////////////////////////////////////////////////
// Function to display the data for one equity.
var showOneStock = function( index ) {

    // Display the data from the 'object'
    
    dataVal = document.querySelector("#stock-price .current");
    dataVal.textContent = stock[index].price;
    dataVal = document.querySelector("#stock-price .min");
    dataVal.textContent = stock[index].priceMin;
    dataVal = document.querySelector("#stock-price .max");
    dataVal.textContent = stock[index].priceMax;
    checkSymbol = verifyInvestmentItem( stock[index].price, stock[index].priceMin, stock[index].priceMax );
    dataVal = document.querySelector("#stock-price .alert");
    dataVal.textContent = checkSymbol;

    dataVal = document.querySelector("#stock-eps .current");
    dataVal.textContent = stock[index].eps;
    dataVal = document.querySelector("#stock-eps .min");
    dataVal.textContent = stock[index].epsMin;
    dataVal = document.querySelector("#stock-eps .max");
    dataVal.textContent = stock[index].epsMax;
    checkSymbol = verifyInvestmentItem( stock[index].eps, stock[index].epsMin, stock[index].epsMax );
    dataVal = document.querySelector("#stock-eps .alert");
    dataVal.textContent = checkSymbol;
    

    dataVal = document.querySelector("#stock-beta .current");
    dataVal.textContent = stock[index].beta;
    dataVal = document.querySelector("#stock-beta .min");
    dataVal.textContent = stock[index].betaMin;
    dataVal = document.querySelector("#stock-beta .max");
    dataVal.textContent = stock[index].betaMax;
    checkSymbol = verifyInvestmentItem( stock[index].beta, stock[index].betaMin, stock[index].betaMax );
    dataVal = document.querySelector("#stock-beta .alert");
    dataVal.textContent = checkSymbol;


    dataVal = document.querySelector("#stock-per .current");
    dataVal.textContent = stock[index].pe;
    dataVal = document.querySelector("#stock-per .min");
    dataVal.textContent = stock[index].peMin;
    dataVal = document.querySelector("#stock-per .max");
    dataVal.textContent = stock[index].peMax;
    checkSymbol = verifyInvestmentItem( stock[index].pe, stock[index].peMin, stock[index].peMax );
    dataVal = document.querySelector("#stock-per .alert");
    dataVal.textContent = checkSymbol;


    dataVal = document.querySelector("#stock-target .current");
    dataVal.textContent = stock[index].target;
    dataVal = document.querySelector("#stock-target .min");
    dataVal.textContent = stock[index].targetMin;
    dataVal = document.querySelector("#stock-target .max");
    dataVal.textContent = stock[index].targetMax;
    checkSymbol = verifyInvestmentItem( stock[index].target, stock[index].targetMin, stock[index].targetMax );
    dataVal = document.querySelector("#stock-target .alert");
    dataVal.textContent = checkSymbol;


    dataVal = document.querySelector("#stock-50avg .current");
    dataVal.textContent = stock[index].f50Avg;
    dataVal = document.querySelector("#stock-50avg .min");
    dataVal.textContent = stock[index].f50AvgMin;
    dataVal = document.querySelector("#stock-50avg .max");
    dataVal.textContent = stock[index].f50AvgMax;
    checkSymbol = verifyInvestmentItem( stock[index].f50Avg, stock[index].f50AvgMin, stock[index].f50AvgMax );
    dataVal = document.querySelector("#stock-50avg .alert");
    dataVal.textContent = checkSymbol;


    dataVal = document.querySelector("#stock-200avg .current");
    dataVal.textContent = stock[index].t200Avg;
    dataVal = document.querySelector("#stock-200avg .min");
    dataVal.textContent = stock[index].t200AvgMin;
    dataVal = document.querySelector("#stock-200avg .max");
    dataVal.textContent = stock[index].t200AvgMax;
    checkSymbol = verifyInvestmentItem( stock[index].t200Avg, stock[index].t200AvgMin, stock[index].t200AvgMax );
    dataVal = document.querySelector("#stock-200avg .alert");
    dataVal.textContent = checkSymbol;


    dataVal = document.querySelector( "#stock-name" );
    dataVal.textContent = stock[index].name; 
    dataVal = document.querySelector( "#stock-symbol" );
    dataVal.textContent = stock[index].symbol;
    dataVal = document.querySelector( "#stock-exchange" );
    dataVal.textContent = stock[index].exchange;

}



//////////////////////////////////////////////////////////////////////////////////////////////////
// Function to display the data for one cryptocurrency.
var showOneCrypto = function( index ) {
    // Display the data from the 'object'
    dataVal = document.querySelector("#crypto-price .current");
    var number = cryptos[index].price;
    var displayString = number.toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionalDigits:4});
    dataVal.textContent = displayString;
    dataVal = document.querySelector("#crypto-price .min");
    dataVal.textContent = cryptos[index].priceMin.toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionalDigits:4});
    dataVal = document.querySelector("#crypto-price .max");
    dataVal.textContent = cryptos[index].priceMax.toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionalDigits:4});
    checkSymbol = verifyInvestmentItem( cryptos[index].price, cryptos[index].priceMin, cryptos[index].priceMax );
    dataVal = document.querySelector("#crypto-price .alert");
    dataVal.textContent = checkSymbol;


    dataVal = document.querySelector("#crypto-volume .current");
    dataVal.textContent = cryptos[index].volume.toLocaleString('en-US"');
    dataVal = document.querySelector("#crypto-volume .min");
    dataVal.textContent = cryptos[index].volumeMin.toLocaleString('en-US"');
    dataVal = document.querySelector("#crypto-volume .max");
    dataVal.textContent = cryptos[index].volumeMax.toLocaleString('en-US"');
    checkSymbol = verifyInvestmentItem( cryptos[index].volume, cryptos[index].volumeMin, cryptos[index].volumeMax );
    dataVal = document.querySelector("#crypto-volume .alert");
    dataVal.textContent = checkSymbol;

  
    dataVal = document.querySelector("#crypto-supply .current");
    dataVal.textContent = cryptos[index].supply.toLocaleString('en-US"');
    dataVal = document.querySelector("#crypto-supply .min");
    dataVal.textContent = cryptos[index].supplyMin.toLocaleString('en-US"');
    dataVal = document.querySelector("#crypto-supply .max");
    dataVal.textContent = cryptos[index].supplyMax.toLocaleString('en-US"');  
    checkSymbol = verifyInvestmentItem( cryptos[index].supply, cryptos[index].supplyMin, cryptos[index].supplyMax );
    dataVal = document.querySelector("#crypto-supply .alert");
    dataVal.textContent = checkSymbol;

      
    dataVal = document.querySelector("#crypto-marcap .current");
    dataVal.textContent = cryptos[index].marketCap.toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionalDigits:0});
    dataVal = document.querySelector("#crypto-marcap .min");
    dataVal.textContent = cryptos[index].marketCapMin.toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionalDigits:0});
    dataVal = document.querySelector("#crypto-marcap .max");
    dataVal.textContent = cryptos[index].marketCapMax.toLocaleString('en-US', {style:'currency', currency:'USD', maximumFractionalDigits:0});  
    checkSymbol = verifyInvestmentItem( cryptos[index].marketCap, cryptos[index].marketCapMin, cryptos[index].marketCapMax );
    dataVal = document.querySelector("#crypto-marcap .alert");
    dataVal.textContent = checkSymbol;
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// Function to display the data for the equity indexes.
var showEquityIndexes = function() {

    // Display the data from the 'object'

    dataVal = document.querySelector("#sp500_raw");
    dataVal.textContent = indexes[0];
    dataVal = document.querySelector("#nasdaq_raw");
    dataVal.textContent = indexes[1];
    dataVal = document.querySelector("#nyse_raw");
    dataVal.textContent = indexes[2];
    dataVal = document.querySelector("#dow_raw");
    dataVal.textContent = indexes[3];
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// Define the function to verify that the 'current value' is within the range defined by
// the 'minValue' and 'maxValue'.
verifyInvestmentItem = function( value, valueMin, valueMax ) {

    // Need to make sure both min/max values are defined.
    if( valueMin == ""  ||  valueMax == "" ) {
        return "?";
    }
    else if( value < valueMin  ||  value > valueMax ) {
        return "*";
    }
    else {
        return " ";
    }

}


//////////////////////////////////////////////////////////////////////////////////////////////////
// Function to save the investment data to local storage.
var saveInvestments = function() {

    // Save the array of stock objects
    localStorage.setItem( "investmentStocks", JSON.stringify( stock ) );

    // save the array of cryptocurrency objects
    localStorage.setItem( "investmentCryptos", JSON.stringify( cryptos ) );

    // Save the array of market index values
    localStorage.setItem( "investmentIndexes", JSON.stringify( indexes ) );
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// Function to save the investment data to local storage.
var retrieveInvestments = function() {
    
    // Retrieve the array of stock objects
    var stocksRead = [];
    stocksRead     = JSON.parse( localStorage.getItem( "investmentStocks" ) );

    if( stocksRead != null ) {
        stock = stocksRead;
    }

    // Retrieve the array of cryptocurrency objects
    var cryptosRead = [];
    cryptosRead     = JSON.parse( localStorage.getItem( "investmentCryptos" ) );

    if( cryptosRead != null ) {
        cryptos = cryptosRead;
    }

    // Retrieve the array of market indexes
    var indexesRead = [];
    indexesRead     = JSON.parse( localStorage.getItem( "investmentIndexes" ) );

    if( indexesRead != null ) {
        indexes = indexesRead;
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////
// Function to obtain the current data, save to local storage if necessary and set the
// update flag.

var getCurrentDay = function() {

    // Get the current day 
    var today = moment().format( 'L' );

    // Try to retrieve the date from local storage. 
    var earlierDate = localStorage.getItem( "savedDate" );

    // If the earlierDate exists, compare it to the current date.  If the dates match, set
    // the flag indicating today's "daily" data has been obtained.  If the date doesn't 
    // match set the flag indicating today's daily data has not been obtained.

    if( earlierDate ) {
        if( today === earlierDate ) {
            dailyCheckStocks  = true;
            dailyCheckCryptos = true;
            //return;   /////  For debugging purposes only /////////  Remove this comment on the return for production //   
        }
        else {
            dailyCheckStocks  = false;
            dailyCheckCryptos = false;
        }
    }

    ///////////  For debugging purposes only //////////////  Remove this for production ////////////
    dailyCheckCyrptos = false;
    dailyCheckStocks  = false;
    ///////////  For debugging purposes only ..............  Remove this for production ///////////

    // For no earlier date, or a different date, save the current date to local storage
    // for the next time this application is run.

    localStorage.setItem( "savedDate", today );
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// Function to play the 'alert' sound for the user, indicating a parameter is out of range.
var playAlert = function() {
    var alertSound = new Audio( "./assets/sounds/alarm07.wav" );
    alertSound.play();

}

//////////////////////////////////////////////////////////////////////////////////////////////////

// stockSymbol  = "IBM";
// cryptoSymbol = "BTC";
// index        = 0;

// getStockParameters( stockSymbol, index );
// getCryptoParameters( cryptoSymbol, index );
// playAlert();


// getCurrentDay();
// retrieveInvestments();           

// getStockParameters( stockSymbol, index );
// getCryptoParameters( cryptoSymbol, index );
//vplayAlert();

// stockSymbol  = "APPL";
// cryptoSymbol = "LTC";
// index        = 1;

// getStockParameters( stockSymbol, index );
// getCryptoParameters( cryptoSymbol, index );


// stockSymbol  = "TSLA";
// cryptoSymbol = "ETC";
// index        = 2;

// getStockParameters( stockSymbol, index );
// getCryptoParameters( cryptoSymbol, index );

// stockSymbol  = "GOOGL";
// cryptoSymbol = "ETC";
// index        = 3;

// getStockParameters( stockSymbol, index );
// getCryptoParameters( cryptoSymbol, index );

// stockSymbol  = "NKLA";
// cryptoSymbol = "ETC";
// index        = 2;

// getStockParameters( stockSymbol, index );
// getCryptoParameters( cryptoSymbol, index );

// saveInvestments();
// Temporary add event listeners.
var searchStockEl = document.querySelector("#stock-search-btn");
var searchCryptoEl = document.querySelector("#crypto-search-btn");
searchStockEl.addEventListener("click", searchStock);
searchCryptoEl.addEventListener("click", searchCrypto);

// Search functions
function searchStock()
{
    // Take value from searchbar textcontent
    var stockVal = document.querySelector("#stock-search").value;

    // Search for stock data
    getStockParameters(stockVal);

    // Save function
    saveInvestments();
}
function invalidStock()
{
    // Clear stock search bar
    document.querySelector("#stock-search").value = "";
}
function searchCrypto()
{
    // Take value from searchbar text content
    // var cryptoVal = document.querySelector("#crypto-search");

    // Search for crypto data

    // Store data in variables

    // Add data to cryptos variable

    // Remake crypto table

    // Save function
    // saveInvestments();
}
// Update functions
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

    // Add data for each stock.
    stock.forEach(function(value)
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
}
function addGeneralHeaders(table)
{
    
}

// Change tabs event listener
tabListEl.addEventListener("click", function(event)
{
    // Getting list element that was clicked on.
    affectedEl = event.target.parentElement;

    // Checks to see if they just clicked on the container or the active tab.
    if(affectedEl.nodeName !== "LI" || affectedEl.classList.contains("is-active"))
    {
        return;
    }
    else
    {
        // Change active element to clicked element.
        affectedEl.classList.add("is-active");
        activeTab.classList.remove("is-active");

        // Hide content from previous tab.
        document.querySelector("#" + activeTab.id.replace("-tab", "page")).classList.add("hidden");

        // Show content from new active tab.
        document.querySelector("#" + affectedEl.id.replace("-tab", "page")).classList.remove("hidden");

        // Set active tab equal to new active tab.
        activeTab = affectedEl;
    }
});