
////////////////////////////////////////////////////////////////////////////
// Global Variable Definitions

var stock = [
    { name: "", symbol: "", exchange: "", priceMin: "", priceMax: "", price: "",
      targetMin: "", targetMax: "", target: "", epsMin: "", epsMax: "", eps: "",
      relStMin: "", relStMax: "", relSt: "", peMin: "", peMax: "", pe: "",
      betaMin: "", betaMax: "", beta: "", f50AvgMin: "", f50AvgMax: "", f50Avg: "",
      t200AvgMin: "", t200AvgMax: "", t200Avg: "", exchange: "" },

      { name: "", symbol: "", exchange: "", priceMin: "", priceMax: "", price: "",
      targetMin: "", targetMax: "", target: "", epsMin: "", epsMax: "", eps: "",
      relStMin: "", relStMax: "", relSt: "", peMin: "", peMax: "", pe: "",
      betaMin: "", betaMax: "", beta: "", f50AvgMin: "", f50AvgMax: "", f50Avg: "",
      t200AvgMin: "", t200AvgMax: "", t200Avg: "", exchange: "" },   
      
      { name: "", symbol: "", exchange: "", priceMin: "", priceMax: "", price: "",
      targetMin: "", targetMax: "", target: "", epsMin: "", epsMax: "", eps: "",
      relStMin: "", relStMax: "", relSt: "", peMin: "", peMax: "", pe: "",
      betaMin: "", betaMax: "", beta: "", f50AvgMin: "", f50AvgMax: "", f50Avg: "",
      t200AvgMin: "", t200AvgMax: "", t200Avg: "", exchange: "" },
      
      { name: "", symbol: "", exchange: "", priceMin: "", priceMax: "", price: "",
      targetMin: "", targetMax: "", target: "", epsMin: "", epsMax: "", eps: "",
      relStMin: "", relStMax: "", relSt: "", peMin: "", peMax: "", pe: "",
      betaMin: "", betaMax: "", beta: "", f50AvgMin: "", f50AvgMax: "", f50Avg: "",
      t200AvgMin: "", t200AvgMax: "", t200Avg: "", exchange: "" },
      
      { name: "", symbol: "", exchange: "", priceMin: "", priceMax: "", price: "",
      targetMin: "", targetMax: "", target: "", epsMin: "", epsMax: "", eps: "",
      relStMin: "", relStMax: "", relSt: "", peMin: "", peMax: "", pe: "",
      betaMin: "", betaMax: "", beta: "", f50AvgMin: "", f50AvgMax: "", f50Avg: "",
      t200AvgMin: "", t200AvgMax: "", t200Avg: "", exchange: "" }
];    

var cryptos = [
    { marketCapMin: "", marketCapMax: "", marketCap: "", priceMin: "", priceMax: "", price: "", 
    volumeMin: "", volumeMax: "", volume: "", supplyMin: "", supplyMax: "", supply: "" },
    { marketCapMin: "", marketCapMax: "", marketCap: "", priceMin: "", priceMax: "", price: "", 
    volumeMin: "", volumeMax: "", volume: "", supplyMin: "", supplyMax: "", supply: "" },
    { marketCapMin: "", marketCapMax: "", marketCap: "", priceMin: "", priceMax: "", price: "", 
    volumeMin: "", volumeMax: "", volume: "", supplyMin: "", supplyMax: "", supply: "" },
    { marketCapMin: "", marketCapMax: "", marketCap: "", priceMin: "", priceMax: "", price: "", 
    volumeMin: "", volumeMax: "", volume: "", supplyMin: "", supplyMax: "", supply: "" },
    { marketCapMin: "", marketCapMax: "", marketCap: "", priceMin: "", priceMax: "", price: "", 
    volumeMin: "", volumeMax: "", volume: "", supplyMin: "", supplyMax: "", supply: "" } ];



var indexes = [4];       // Indexes are: S&P, NASDAQ, NYSE, DOW

var stockSymbol;
var index;               // the index into the 'stock' array
var dailyCheckStocks;    // if "true", the daily parameters have been obtained, no need to request again.
var dailyCheckCyrptos;   // if "true", the daily parameters have been obtained, no need to request again.
var dataVal;             // generic data value.

// Tab button queries


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
//var apiNomicsCryptoPrice    = "https://cors-anywhere.herokuapp.com/https://api.nomics.com/v1/currencies/ticker?key=";
var apiNomicsCryptoPrice    = "https://api.nomics.com/v1/currencies/ticker?key=";
var apiNomicsIds            = "&ids=";
var apiNomicsInterval       = "&interval=1d&convert=USD";



///////////////////////////////////////////////////////////////////////////
// Function to acquire the current data for a specified stock
var getStockParameters = function (stockSymbol, index) {

        // Construct the finished URL to obtain the current stock price.
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
                stock[index].price = response.c;
                console.log("Price: ", stock[index].price);

                // Update the HTML page with this value
                dataVal = document.querySelector("#stock-price .current");
                dataVal.textContent = response.c;
            })

            .then(function () {

                // Construct the finished URL to obtain the stock parameters (once only)
                if( dailyCheckStocks ) {
                    showOneStock( index );           // show the saved data for the current day
                    showEquityIndexes( index );
                    return;
                }

                finalUrl = apiStockParamsUrl + stockSymbol + urlKeyStockAlphaAdvantage;

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
                        stock[index].symbol   = stockSymbol;
                        stock[index].exchange = response.Exchange;
                        stock[index].eps      = response.EPS;
                        stock[index].beta     = response.Beta;
                        stock[index].pe       = response.PERatio;
                        stock[index].name     = response.Name;
                        stock[index].target   = response.AnalystTargetPrice;
                        stock[index].f50Avg   = response["50DayMovingAverage"];
                        stock[index].t200Avg  = response["200DayMovingAverage"];

                        // Update the HTML page with these values
                        showOneStock( index );


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

                // Reset the "dailyCheck" flag, so this is only done once.
                dailyCheckStocks = true;
                
                
                // Construct the finished URL to obtain the market index values (once only)
                finalUrl = apiMarketIndexUrl + urlKeyFinancialModeling;

                // Make the request for the stock's data
                fetch(finalUrl)
                    .then(function (response) {
                        console.log("financial modeling prep success");
                        return response.json();
                    })
                    .then(function (response) {
                        console.log("financial modeling prep to json success");
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

                        // Update the HTML page with these values
                        showEquityIndexes( index );

                        saveInvestments();

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
            console.log( "Crypto Data: ", response );

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

    .catch(function (error) {
        // Notice this `.catch()` is chained onto the end of the `.then()` method
        alert("Unable to connect to Nomics for crypto data.");
        returnValue = -1;
        return (returnValue);
    });

}



//////////////////////////////////////////////////////////////////////////////////////////////////
// Function to display the data for one equity.
var showOneStock = function( index ) {

    // Display the data from the 'object'
    dataVal = document.querySelector("#stock-eps .current");
    dataVal.textContent = stock[index].eps;
    dataVal = document.querySelector("#stock-eps .min");
    dataVal.textContent = stock[index].epsMin;
    dataVal = document.querySelector("#stock-eps .max");
    dataVal.textContent = stock[index].epsMax;
    

    dataVal = document.querySelector("#stock-beta .current");
    dataVal.textContent = stock[index].beta;
    dataVal = document.querySelector("#stock-beta .min");
    dataVal.textContent = stock[index].betaMin;
    dataVal = document.querySelector("#stock-beta .max");
    dataVal.textContent = stock[index].betaMax;


    dataVal = document.querySelector("#stock-per .current");
    dataVal.textContent = stock[index].pe;
    dataVal = document.querySelector("#stock-per .min");
    dataVal.textContent = stock[index].peMin;
    dataVal = document.querySelector("#stock-per .max");
    dataVal.textContent = stock[index].peMax;


    dataVal = document.querySelector("#stock-target .current");
    dataVal.textContent = stock[index].target;
    dataVal = document.querySelector("#stock-target .min");
    dataVal.textContent = stock[index].targetMin;
    dataVal = document.querySelector("#stock-target .max");
    dataVal.textContent = stock[index].targetMax;


    dataVal = document.querySelector("#stock-50avg .current");
    dataVal.textContent = stock[index].f50Avg;
    dataVal = document.querySelector("#stock-50avg .min");
    dataVal.textContent = stock[index].f50AvgMin;
    dataVal = document.querySelector("#stock-50avg .max");
    dataVal.textContent = stock[index].f50AvgMax;


    dataVal = document.querySelector("#stock-200avg .current");
    dataVal.textContent = stock[index].t200Avg;
    dataVal = document.querySelector("#stock-200avg .min");
    dataVal.textContent = stock[index].t200AvgMin;
    dataVal = document.querySelector("#stock-200avg .max");
    dataVal.textContent = stock[index].t200AvgMax;


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
    dataVal.textContent = cyrptos[index].price;
    dataVal = document.querySelector("#crypto-price .min");
    dataVal.textContent = cyrptos[index].priceMin;
    dataVal = document.querySelector("#crypto-price .max");
    dataVal.textContent = cyrptos[index].priceMax;

    dataVal = document.querySelector("#crypto-volume .current");
    dataVal.textContent = cyrptos[index].volume;
    dataVal = document.querySelector("#crypto-volume .min");
    dataVal.textContent = cyrptos[index].volumeMin;
    dataVal = document.querySelector("#crypto-volume .max");
    dataVal.textContent = cyrptos[index].volumeMax;
  
    dataVal = document.querySelector("#crypto-supply .current");
    dataVal.textContent = cyrptos[index].supply;
    dataVal = document.querySelector("#crypto-supply .min");
    dataVal.textContent = cyrptos[index].supplyMin;
    dataVal = document.querySelector("#crypto-supply .max");
    dataVal.textContent = cyrptos[index].supplyMax;  
      
    dataVal = document.querySelector("#crypto-marcap .current");
    dataVal.textContent = cyrptos[index].marketCap;
    dataVal = document.querySelector("#crypto-marcap .min");
    dataVal.textContent = cyrptos[index].marketCapMin;
    dataVal = document.querySelector("#crypto-marcap .max");
    dataVal.textContent = cyrptos[index].marketCapMax;  
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

stockSymbol  = "IBM";
cryptoSymbol = "BTC";
index        = 0;


getCurrentDay();
retrieveInvestments();           

getStockParameters( stockSymbol, index );
getCryptoParameters( cryptoSymbol, index );
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


