////////////////////////////////////////////////////////////////////////////
// Global Variable Definitions

var dailyCheckStocks;    // if "true", the daily parameters have been obtained, no need to request again.
var checkSymbol;         // symbol for the "alert" columns

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Start a timer to update the stock and cryptocurrency pages every 10 minutes.
var updateAll = setInterval( function() 
{
    console.log( "In 10-min update function.");
    
    // Update the data in the 'stock' array.
    stock.forEach(function(value, index)
    {
        updateStockParameters(index);
        updateStockAlerts();
    });

    // Update the data in the 'cryptos' array.
    cryptos.forEach(function(value, index)
    {
        updateCryptoParameters(index);
        updateCryptoAlerts();
    });

}, (1000 * 60 * 10) );   // 1000 milliseconds/second * 60 seconds/minute * 10 minutes.

retrieveInvestments();
updateStockTable();
updateCryptoTable();