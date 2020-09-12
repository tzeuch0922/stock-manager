
////////////////////////////////////////////////////////////////////////////
// Global Variable Definitions

var stock = [
    { name: "", symbol: "", exchange: "", priceMin: "", priceMax: "", price: "",
      targetMin: "", targetMax: "", target: "", epsMin: "", epsMax: "", eps: "",
      relStMin: "", relStMax: "", relSt: "", peMin: "", peMax: "", pe: "",
      betaMin: "", betaMax: "", beta: "", f50AvgMin: "", f50AvgMax: "", f50Avg: "",
      t200AvgMin: "", t200AvgMax: "", t200Avg: "" },

      { name: "", symbol: "", exchange: "", priceMin: "", priceMax: "", price: "",
      targetMin: "", targetMax: "", target: "", epsMin: "", epsMax: "", eps: "",
      relStMin: "", relStMax: "", relSt: "", peMin: "", peMax: "", pe: "",
      betaMin: "", betaMax: "", beta: "", f50AvgMin: "", f50AvgMax: "", f50Avg: "",
      t200AvgMin: "", t200AvgMax: "", t200Avg: "" },   
      
      { name: "", symbol: "", exchange: "", priceMin: "", priceMax: "", price: "",
      targetMin: "", targetMax: "", target: "", epsMin: "", epsMax: "", eps: "",
      relStMin: "", relStMax: "", relSt: "", peMin: "", peMax: "", pe: "",
      betaMin: "", betaMax: "", beta: "", f50AvgMin: "", f50AvgMax: "", f50Avg: "",
      t200AvgMin: "", t200AvgMax: "", t200Avg: "" },
      
      { name: "", symbol: "", exchange: "", priceMin: "", priceMax: "", price: "",
      targetMin: "", targetMax: "", target: "", epsMin: "", epsMax: "", eps: "",
      relStMin: "", relStMax: "", relSt: "", peMin: "", peMax: "", pe: "",
      betaMin: "", betaMax: "", beta: "", f50AvgMin: "", f50AvgMax: "", f50Avg: "",
      t200AvgMin: "", t200AvgMax: "", t200Avg: "" },
      
      { name: "", symbol: "", exchange: "", priceMin: "", priceMax: "", price: "",
      targetMin: "", targetMax: "", target: "", epsMin: "", epsMax: "", eps: "",
      relStMin: "", relStMax: "", relSt: "", peMin: "", peMax: "", pe: "",
      betaMin: "", betaMax: "", beta: "", f50AvgMin: "", f50AvgMax: "", f50Avg: "",
      t200AvgMin: "", t200AvgMax: "", t200Avg: "" }
];    

var cryptos = [
    { marketCap: "", price: "", volume: "", supply: "", score: "" },
    { marketCap: "", price: "", volume: "", supply: "", score: "" },
    { marketCap: "", price: "", volume: "", supply: "", score: "" },
    { marketCap: "", price: "", volume: "", supply: "", score: "" },
    { marketCap: "", price: "", volume: "", supply: "", score: "" } ];



var indexes = [4];       // Indexes are: S&P, NASDAQ, NYSE, DOW

var stockSymbol;
var index;               // the index into the 'stock' array
var dailyCheck = false;  // if "true", the daily parameters have been obtained, no need to request again.
var dataVal;             // generic data value.



///////////////////////////////////////////////////////////////////////////
// API URLs
var urlKeyAlphaAdvantage    = "&apikey=XMDSSBDY4JYPVPPD";
var apiStockParamsUrl       = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=";
var apiStockPriceUrl        = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=";
var apiCryptoScoreUrl       = "https://www.alphavantage.co/query?function=CRYPTO_RATING&symbol=";

var urlKeyFinancialModeling = "a107f24e0f6aaac5f180293fa869cd10";
var apiMarketIndexUrl       = "https://financialmodelingprep.com/api/v3/quotes/index?apikey=";

var urlKeyFinnhub           = "&token=btdd1gf48v6t4umjmegg";
var apiFinnhubStockPriceUrl = "https://finnhub.io/api/v1/quote?symbol=";

var urlKeyNomics            = "25f6ac7783932e08f376ee60095ddd35";
var apiNomicsCryptoPrice    = "https://api.nomics.com/v1/currencies/ticker?key=";
var apiNomicsIds            = "&ids=";
var apiNomicsInterval       = "&interval=1d&convert=USD";



///////////////////////////////////////////////////////////////////////////
// Function to acquire the current data for a specified stock
var getStockParameters = function (stockSymbol, index) {

        // Construct the finished URL to obtain the current stock price.
        //var finalUrl = apiStockPriceUrl + stockSymbol + urlKeyAlphaAdvantage;
        var finalUrl = apiFinnhubStockPriceUrl + stockSymbol + urlKeyFinnhub;

        // Make the request for the stock's price
        fetch(finalUrl)
            .then(function (response) {
    
                return response.json();
            })
            .then(function (response) {
                console.log( response );
    
                // Verify that data was acquired
                if (response.cod == 404) {
                    returnValue = -1;
                    return (returnValue);
                }
    
                // Put the stock's price data in the return variable.
                // var value = "Global Quote.price";
                // stock[index].price = response["Global Quote"]["05. price"];current
                stock[index].price = response.c;
                console.log("Price: ", stock[index].price);

                // Update the HTML page with this value
                dataVal = document.querySelector( "#stock-price .current" );
                dataVal.textContent = response.c;

                return;
            })

            .then(function () {

                // Check/Reset the "dailyCheck" flag, so this is only done once.
                if( dailyCheck ) {
                    return;
                }
                else {
                    dailyCheck = true;
                }

                // Construct the finished URL to obtain the stock parameters (once only)
                finalUrl = apiStockParamsUrl + stockSymbol + urlKeyAlphaAdvantage;

                // Make the request for the stock's data
                fetch(finalUrl)
                    .then(function (response) {

                        return response.json();
                    })
                    .then(function (response) {
                        console.log(response);

                        // Verify that data was acquired
                        if (response.cod == 404) {
                            returnValue = -1;
                            return (returnValue);
                        }

                        // Put the stock's data in the return variables.
                        stock[index].eps     = response.EPS;
                        stock[index].beta    = response.Beta;
                        stock[index].pe      = response.PERatio;
                        stock[index].name    = response.name;
                        stock[index].target  = response.AnalystTargetPrice;
                        stock[index].f50Avg  = response["50DayMovingAverage"];
                        stock[index].t200Avg = response["200DayMovingAverage"];

                        console.log("Name: ", stock[index].name );
                        console.log("EPS: ", stock[index].eps );
                        console.log("beta: ", stock[index].beta );
                        console.log("pe: ", stock[index].pe );
                        console.log("target: ", stock[index].target );
                        console.log("50 day average: ", stock[index].f50Avg );
                        console.log("200 day average: ", stock[index].t200Avg );
                    })
            })

            .then(function () {
                // Check/Reset the "dailyCheck" flag, so this is only done once.
                if( dailyCheck ) {
                    return;
                }
                
                // Construct the finished URL to obtain the market index values (once only)
                finalUrl = apiMarketIndexUrl + urlKeyFinancialModeling;

                // Make the request for the stock's data
                fetch(finalUrl)
                    .then(function (response) {

                        return response.json();
                    })
                    .then(function (response) {
                        console.log(response);

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
                        console.log( "Index Prices: ", indexes );

                    })
            })

        .catch(function (error) {
            // Notice this `.catch()` is chained onto the end of the `.then()` method
            alert("Unable to connect to AlphaAdvantage for stock data.");
            returnValue = -1;
            return (returnValue);
        });

}

///////////////////////////////////////////////////////////////////////////
// Function to acquire the current data for a specified cryptocurrency
var getCryptoParameters = function (cryptoSymbol, index) {

    // Construct the finished URL to obtain the current cryptocurrency data.
    var finalUrl = apiNomicsCryptoPrice + urlKeyNomics + apiNomicsIds + cryptoSymbol + apiNomicsInterval;

    // Make the request for the currency's data
    fetch(finalUrl)
        .then(function (response) {

            return response.json();
        })
        .then(function (response) {
            console.log( response );

            // Verify that data was acquired
            if (response.cod == 404) {
                returnValue = -1;
                return (returnValue);
            }

            // Put the currency's  data in the return variables.
            cryptos[index].price     = response[0].price;
            cryptos[index].volume    = response[0].circulating_supply;
            cryptos[index].supply    = response[0].max_supply;
            cryptos[index].marketCap = response[0].market_cap;


            return;
        })

        // .then(function () {

        //     // Construct the finished URL to obtain the currency's 'Asset Score'
        //     finalUrl = apiCryptoScoreUrl + cryptoSymbol + urlKeyAlphaAdvantage;

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

        // .then(function () {
        //     // Check/Reset the "dailyCheck" flag, so this is only done once.
        //     if( dailyCheck ) {
        //         return;
        //     }
            
        //     // Construct the finished URL to obtain the market index values (once only)
        //     finalUrl = apiMarketIndexUrl + urlKeyFinancialModeling;

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

        //             // Get the index values and put them in the return variables.
        //             indexes[0] = response[7].price;     // S&P 500
        //             indexes[1] = response[19].price;    // NASDAQ
        //             indexes[2] = response[12].price;    // NYSE
        //             indexes[3] = response[31].price;    // DOW
        //             console.log( "Index Prices: ", indexes );

        //         })
        // })

    .catch(function (error) {
        // Notice this `.catch()` is chained onto the end of the `.then()` method
        alert("Unable to connect to AlphaAdvantage for stock data.");
        returnValue = -1;
        return (returnValue);
    });

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
// Function to play the 'alert' sound for the user, indicating a parameter is out of range.
var playAlert = function() {
    var alertSound = new Audio( "./assets/sounds/alarm07.wav" );
    alertSound.play();

}

//////////////////////////////////////////////////////////////////////////////////////////////////

stockSymbol  = "IBM";
cryptoSymbol = "BTC";
index        = 0;

getStockParameters( stockSymbol, index );
//getCryptoParameters( cryptoSymbol, index );
//playAlert();


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
