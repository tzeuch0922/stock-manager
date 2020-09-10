
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

var stockSymbol;
var index;             // the index into the 'stock' array



///////////////////////////////////////////////////////////////////////////
// API URLs
urlKeyAlphaAdvantage  = "&apikey=XMDSSBDY4JYPVPPD";
var apiStockParamsUrl = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=";
var apiStockPriceUrl  = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=";



///////////////////////////////////////////////////////////////////////////
// Function to acquire the current data for a specified stock
var getStockParameters = function (stockSymbol, index) {

    // Construct the finished URL
    var finalUrl = apiStockParamsUrl + stockSymbol + urlKeyAlphaAdvantage;

    // Make the request for the stock's data
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

            // Put the stock's data in the return variables.
            stock[index].eps     = response.EPS;
            stock[index].beta    = response.Beta;
            stock[index].pe      = response.PERatio;
            stock[index].target  = response.AnalystTargetPrice;
            //stock[index].f50Avg  = response."50DayMovingAverage";
            //stock[index].t200Avg = response."200DayMovingAverage";

        })
        .catch(function (error) {
            // Notice this `.catch()` is chained onto the end of the `.then()` method
            alert("Unable to connect to AlphaAdvantage for stock parameters.");
            returnValue = -1;
            return (returnValue);
        });

}

///////////////////////////////////////////////////////////////////////////
// Function to acquire the current data for a specified stock
var getStockPrice = function (stockSymbol, index) {

    // Construct the finished URL
    var finalUrl = apiStockPriceUrl + stockSymbol + urlKeyAlphaAdvantage;

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

            // Put the stock's data in the return variables.
            stock[index].price = response.price;


        })
        .catch(function (error) {
            // Notice this `.catch()` is chained onto the end of the `.then()` method
            alert("Unable to connect to AlphaAdvantage for stock pricing.");
            returnValue = -1;
            return (returnValue);
        });

}

//////////////////////////////////////////////////////////////////////////////////////////////////

stockSymbol = "IBM";
index       = 0;

getStockParameters( stockSymbol, index );
getStockPrice( stockSymbol, index );