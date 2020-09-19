//////////////////////////////////////////////////////////////
//                  Main Function                           //
//////////////////////////////////////////////////////////////

// Start a timer to update the stock and cryptocurrency pages every 10 minutes.
var updateAll = setInterval( function() 
{
    // Update the data in the 'stock' array.
    stock.forEach(function(value, index)
    {
        updateStockParameters(index);
    });

    // Update the data in the 'cryptos' array.
    cryptos.forEach(function(value, index)
    {
        updateCryptoParameters(index);
    });
    saveInvestments();
}, (1000 * 60 * 10));   // 1000 milliseconds/second * 60 seconds/minute * 10 minutes.

retrieveInvestments();
updateStockTable();
updateCryptoTable();