//////////////////////////////////////////////////////////////
//                  Global Variables                        //
//////////////////////////////////////////////////////////////

// Button Queries
var editCryptoButton = document.querySelector("#crypto-edit-btn");
var cryptoConfirmEl = document.querySelector("#crypto-confirm-btn");
var closeCryptoButtonEl = document.querySelector("#crypto-close-btn");
var cryptoXButtonEl = document.querySelector("#crypto-close");
var cryptoRemoveEl = document.querySelector("#crypto-remove-btn");

// Event Listeners
editCryptoButton.addEventListener("click", editCryptoAlerts);
cryptoConfirmEl.addEventListener("click", confirmCryptoEdits);
closeCryptoButtonEl.addEventListener("click", closeCryptoEdit);
cryptoXButtonEl.addEventListener("click", closeCryptoEdit);
cryptoRemoveEl.addEventListener("click", removeCrypto);

// API URLs and API keys
var urlKeyNomics            = "25f6ac7783932e08f376ee60095ddd35";
var apiNomicsCryptoPrice    = "https://cors-anywhere.herokuapp.com/https://api.nomics.com/v1/currencies/ticker?key=";
// https://cors-anywhere.herokuapp.com/
var apiNomicsIds            = "&ids=";
var apiNomicsInterval       = "&interval=1d&convert=USD";

//////////////////////////////////////////////////////////////
//                  Crypto Search Functions                 //
//////////////////////////////////////////////////////////////

// Search function to be called when search button is pressed.
function searchCrypto()
{
    // Take value from searchbar text content
    var cryptoVal = document.querySelector("#crypto-search").value.toUpperCase();

    // Make sure the entered ticker is not a duplicate of one already defined.
    var duplicate = checkForDuplicateCryptos( cryptoVal );

    if( duplicate ) 
    {
        return;
    }
    // Search for crypto data
    getCryptoParameters(cryptoVal);

    // Save function
    saveInvestments();
}

// Function to search for a duplicate crypto ticker
checkForDuplicateCryptos = function( cryptoVal ) 
{
    for( var i = 0; i < cryptos.length; i++ ) 
    {
        if( cryptos[i].symbol === cryptoVal.toUpperCase() ) 
        {
            // Clear crypto search bar
            document.querySelector("#crypto-search").value = "";
            return true;
        }
    }
    return false;
}

// Function to acquire the current data for a specified crypto
var getCryptoParameters = function (cryptoSymbol) {

    // Construct the finished URL to obtain the current cryptocurrency data.
    var finalUrl = apiNomicsCryptoPrice + urlKeyNomics + apiNomicsIds + cryptoSymbol + apiNomicsInterval;
    cryptoValues = 
    {
        name: "",
        symbol: "",
        alert: errorIconSm,
        price: "",
        priceMin: "",
        priceMax: "",
        priceAlert: errorIcon,
        volume: "",
        volumeMin: "",
        volumeMax: "",
        volumeAlert: errorIcon,
        supply: "",
        supplyMin: "",
        supplyMax: "",
        supplyAlert: errorIcon,
        marcap: "",
        marcapMin: "",
        marcapMax: "",
        marcapAlert: errorIcon
    };

    // Make the request for the currency's data
    fetch(finalUrl).then(function (response) 
    {
        return response.json();
    }).then(function (response) 
    {
        // Verify that data was acquired
        // if (response.cod == 404) {
        //     returnValue = -1;
        //     return (returnValue);
        // }
        if(!response[0].name)
        {
            throw "not found";
        }

        // Put the currency's  data in the return variables.
        cryptoValues.name      = response[0].name;
        cryptoValues.symbol    = response[0].symbol;
        cryptoValues.price     = response[0].price;
        cryptoValues.volume    = response[0].circulating_supply;
        cryptoValues.supply    = response[0].max_supply;
        cryptoValues.marcap    = response[0].market_cap;

        cryptos.push(cryptoValues);

        updateCryptoTable();

        saveInvestments();

        return;
    })
    .catch(function (error) 
    {
        console.log(error);
        invalidCrypto();
        return;
    });
}

// Function to update the data for the crypto at the specified index.
var updateCryptoParameters = function (index) 
{
    // Get the stock symbol from the array.
    var cryptoSymbol = cryptos[index].symbol;

    // Construct the finished URL to obtain the current cryptocurrency data.
    var finalUrl = apiNomicsCryptoPrice + urlKeyNomics + apiNomicsIds + cryptoSymbol + apiNomicsInterval;

    // Make the request for the currency's data
    fetch(finalUrl).then(function (response) 
    {
        return response.json();
    }).then(function (response) 
    {
        if(!response[0].name)
        {
            throw "not found";
        }

        // Put the currency's  data in the return variables.
        cryptos[index].price     = response[0].price;
        cryptos[index].volume    = response[0].circulating_supply;
        cryptos[index].supply    = response[0].max_supply;
        cryptos[index].marcap    = response[0].market_cap;

        // showOneCrypto(cryptos.length - 1);
        saveInvestments();

        return;
    }).then(function()
    {
        if(document.querySelector("#select-crypto-list").value !== "")
        {
            showOneCrypto(document.querySelector("#select-crypto-list").value);
        }
        updateCryptoAlerts();
    })
    .catch(function (error) 
    {
        console.log(error);
        invalidCrypto();
        return;
    });
}

//////////////////////////////////////////////////////////////
//               Crypto Search Error Functions              //
//////////////////////////////////////////////////////////////

// Opens error modal and clears crypto-search bar
function invalidCrypto()
{
    // Clear crypto search bar
    document.querySelector("#crypto-search").value = "";

    // Query for error modal
    var errorModalEl = document.querySelector("#error-modal");

    // Set modal to active
    errorModalEl.classList.add("is-active");
}

//////////////////////////////////////////////////////////////
//              Crypto Table Update Functions               //
//////////////////////////////////////////////////////////////

// Update all crypto tables and the crypto select menu
function updateCryptoTable()
{
    // Get general crypto table element.
    var generalCryptoTableEl = document.querySelector("#general-crypto-table");

    // Clear table.
    generalCryptoTableEl.innerHTML = "";

    // Add title row to table.
    var titleRowEl = document.createElement("tr");
    var titleEl = document.createElement("th");
    titleEl.setAttribute("colspan","3");
    titleEl.classList.add("has-text-centered");
    titleEl.textContent = "Cryptocurrency";
    titleRowEl.appendChild(titleEl);
    generalCryptoTableEl.appendChild(titleRowEl);

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
    generalCryptoTableEl.appendChild(headerRowEl);
    
    // Clear select menu
    var selectMenuEl = document.querySelector("#select-crypto-list");
    selectMenuEl.innerHTML = "";

    // Add default select item
    var defaultSelectEl = document.createElement("option");
    defaultSelectEl.value = "";
    defaultSelectEl.text = "Watched Cryptocurrency";
    defaultSelectEl.setAttribute("selected", true);
    defaultSelectEl.setAttribute("hidden", true);
    defaultSelectEl.setAttribute("disabled", true);

    selectMenuEl.appendChild(defaultSelectEl);

    // Add item for when no crypto are present.
    if(cryptos.length === 0)
    {
        var selectItemEl = document.createElement("option");
        selectItemEl.value = "";
        selectItemEl.text = "No cryptocurrency found.";
        selectItemEl.setAttribute("disabled", true);

        selectMenuEl.appendChild(selectItemEl);
    }

    // Hide crypto info
    var cryptoInfoEl = document.querySelector("#select-crypto");
    if(!cryptoInfoEl.classList.contains("hidden"))
    {
        cryptoInfoEl.classList.add("hidden");
    }

    // Add data for each crypto.
    cryptos.forEach(function(value, index)
    {
        // Add data to general table for each crypto.
        var dataRowEl = document.createElement("tr");
        var nameEl = document.createElement("td");
        var symbolEl = document.createElement("td");
        var alertEl = document.createElement("td");

        nameEl.textContent = value.name;
        symbolEl.textContent = value.symbol;
        alertEl.classList.add("has-text-centered");
        alertEl.innerHTML = value.alert;
        alertEl.id = "crypto-alert-" + index;

        dataRowEl.appendChild(nameEl);
        dataRowEl.appendChild(symbolEl);
        dataRowEl.appendChild(alertEl);
        
        generalCryptoTableEl.appendChild(dataRowEl);

        // Add option to select menu.
        var selectItemEl = document.createElement("option");
        selectItemEl.value = index;
        selectItemEl.text = value.name;

        selectMenuEl.appendChild(selectItemEl);
    });

    // Add search bar on crypto table on general page
    if(cryptos.length < 5)
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
        inputEl.setAttribute("placeholder", "Enter cryptocurrency symbol");
        inputEl.id = "crypto-search";
        inputContainerEl.appendChild(inputEl);
        searchContainerEl.appendChild(inputContainerEl);

        var btnContainerEl = document.createElement("p");
        btnContainerEl.classList.add("control");
        var btnEl = document.createElement("a");
        btnEl.classList.add("button", "is-info");
        btnEl.id = "crypto-search-btn";
        btnEl.textContent = "Search";
        btnEl.addEventListener("click", searchCrypto);
        btnContainerEl.appendChild(btnEl);
        searchContainerEl.appendChild(btnContainerEl);

        searchEl.appendChild(searchContainerEl);
        searchRowEl.appendChild(searchEl);

        generalCryptoTableEl.appendChild(searchRowEl);
    }

    saveInvestments();
}

// Function to be called when select menu is changed
function updateMainCrypto()
{
    // Query select menu
    var selectCryptoEl = document.querySelector("#select-crypto-list");
    showOneCrypto(selectCryptoEl.value);
}

// Function to display the data for one cryptocurrency.
var showOneCrypto = function( index ) {

    // Query and display crypto-info.
    var cryptoInfoEl = document.querySelector("#select-crypto");
    if(cryptoInfoEl.classList.contains("hidden"))
    {
        cryptoInfoEl.classList.remove("hidden");
    }

    // Display the price of the crypto
    dataVal = document.querySelector("#crypto-price-current");
    dataVal.textContent = parseFloat(cryptos[index].price).toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 4, maximumFractionalDigits:4});
    dataVal = document.querySelector("#crypto-price-modal");
    dataVal.textContent = parseFloat(cryptos[index].price).toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 4, maximumFractionalDigits:4});
    dataVal = document.querySelector("#crypto-price-min");
    if(cryptos[index].priceMin !== "")
    {
        dataVal.textContent = parseFloat(cryptos[index].priceMin).toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 4, maximumFractionalDigits:4});
    }
    else
    {
        dataVal.textContent = "";
    }
    dataVal = document.querySelector("#crypto-price-max");
    if(cryptos[index].priceMax !== "")
    {
        dataVal.textContent = parseFloat(cryptos[index].priceMax).toLocaleString('en-US', {style:'currency', currency:'USD',  minimumFractionDigits: 4, maximumFractionalDigits:4});
    }
    else
    {
        dataVal.textContent = "";
    }
    checkSymbol = verifyInvestmentItem( cryptos[index].price, cryptos[index].priceMin, cryptos[index].priceMax );
    cryptos[index].priceAlert = checkSymbol;
    dataVal = document.querySelector("#crypto-price-alert");
    dataVal.innerHTML = checkSymbol;

    // display the volume of the crypto
    dataVal = document.querySelector("#crypto-volume-current");
    dataVal.textContent = parseFloat(cryptos[index].volume).toLocaleString('en-US');
    dataVal = document.querySelector("#crypto-volume-modal");
    dataVal.textContent = parseFloat(cryptos[index].volume).toLocaleString('en-US');
    dataVal = document.querySelector("#crypto-volume-min");
    if(cryptos[index].volumeMin !== "")
    {    
        dataVal.textContent = parseFloat(cryptos[index].volumeMin).toLocaleString('en-US');
    }    
    else
    {
        dataVal.textContent = "";
    }
    dataVal = document.querySelector("#crypto-volume-max");
    if(cryptos[index].volumeMax !== "")
    {    
        dataVal.textContent = parseFloat(cryptos[index].volumeMax).toLocaleString('en-US');
    }    
    else
    {
        dataVal.textContent = "";
    }
    checkSymbol = verifyInvestmentItem( cryptos[index].volume, cryptos[index].volumeMin, cryptos[index].volumeMax );
    cryptos[index].volumeAlert = checkSymbol;
    dataVal = document.querySelector("#crypto-volume-alert");
    dataVal.innerHTML = checkSymbol;

    // display the supply of the crypto
    dataVal = document.querySelector("#crypto-supply-current");
    dataVal.textContent = parseFloat(cryptos[index].supply).toLocaleString('en-US');
    dataVal = document.querySelector("#crypto-supply-modal");
    dataVal.textContent = parseFloat(cryptos[index].supply).toLocaleString('en-US');
    dataVal = document.querySelector("#crypto-supply-min");
    if(cryptos[index].supplyMin !== "")
    {    
        dataVal.textContent = parseFloat(cryptos[index].supplyMin).toLocaleString('en-US');
    }
    else
    {
        dataVal.textContent = "";
    }
    dataVal = document.querySelector("#crypto-supply-max");
    if(cryptos[index].supplyMax !== "")
    {    
        dataVal.textContent = parseFloat(cryptos[index].supplyMax).toLocaleString('en-US');  
    }
    else
    {
        dataVal.textContent = "";
    }
    checkSymbol = verifyInvestmentItem( cryptos[index].supply, cryptos[index].supplyMin, cryptos[index].supplyMax );
    cryptos[index].supplyAlert = checkSymbol;
    dataVal = document.querySelector("#crypto-supply-alert");
    dataVal.innerHTML = checkSymbol;

    // display market cap of crypto
    dataVal = document.querySelector("#crypto-marcap-current");
    dataVal.textContent = parseFloat(cryptos[index].marcap).toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits:0});
    dataVal = document.querySelector("#crypto-marcap-modal");
    dataVal.textContent = parseFloat(cryptos[index].marcap).toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits:0});
    dataVal = document.querySelector("#crypto-marcap-min");
    if(cryptos[index].marcapMin !== "")
    {    
        dataVal.textContent = parseFloat(cryptos[index].marcapMin).toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits:0});
    }    
    else
    {
        dataVal.textContent = "";
    }
    dataVal = document.querySelector("#crypto-marcap-max");
    if(cryptos[index].marcapMax !== "")
    {    
        dataVal.textContent = parseFloat(cryptos[index].marcapMax).toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits:0});  
    }    
    else
    {
        dataVal.textContent = "";
    }
    checkSymbol = verifyInvestmentItem( cryptos[index].marcap, cryptos[index].marcapMin, cryptos[index].marcapMax );
    cryptos[index].marcapAlert = checkSymbol;
    dataVal = document.querySelector("#crypto-marcap-alert");
    dataVal.innerHTML = checkSymbol;

    // display the basic info of the crypto
    dataVal = document.querySelector( "#crypto-name" );
    dataVal.textContent = cryptos[index].name;
    dataVal = document.querySelector( "#crypto-symbol" );
    dataVal.textContent = cryptos[index].symbol;
}

// Updates all alerts
function updateCryptoAlerts()
{
    var playAlert = false;
    cryptos.forEach(function(value, index)
    {
        var alerts = [];
        value.priceAlert = verifyInvestmentItem(value.price, value.priceMin, value.priceMax);
        alerts.push(value.priceAlert);
        value.volumeAlert = verifyInvestmentItem(value.volume, value.volumeMin, value.volumeMax);
        alerts.push(value.volumeAlert);
        value.supplyAlert = verifyInvestmentItem(value.supply, value.supplyMin, value.supplyMax);
        alerts.push(value.supplyAlert);
        value.marcapAlert = verifyInvestmentItem(value.marcap, value.marcapMin, value.marcapMax);
        alerts.push(value.marcapAlert);

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
        if(prioritizedValue === alertIcon)
        {
            playAlert = true;
            value.alert = alertIconSm;
        }
        else if(prioritizedValue === checkIcon)
        {
            value.alert = checkIconSm;
        }
        else
        {
            value.alert = errorIconSm;
        }

        // Update general crypto table only
        document.querySelector("#crypto-alert-"+index).innerHTML = value.alert;
    });
    if(playAlert)
    {
        playSound();
    }
    saveInvestments();
}

// Remove current crypto
function removeCrypto()
{
    // Get list index of active crypto element
    var index = document.querySelector("#select-crypto-list").value;

    // Remove element from list.
    cryptos.splice(index, 1);

    // Update table and hide it
    updateCryptoTable();
    saveInvestments();
}

//////////////////////////////////////////////////////////////
//                  Edit Modal Functions                    //
//////////////////////////////////////////////////////////////

// Edit crypto data
function editCryptoAlerts()
{
    // Get list index of active crypto element
    var index = document.querySelector("#select-crypto-list").value;

    // Populate input values, if they exist
    document.querySelector("#crypto-price-input .min").value = cryptos[index].priceMin;
    document.querySelector("#crypto-price-input .max").value = cryptos[index].priceMax;
    
    document.querySelector("#crypto-volume-input .min").value = cryptos[index].volumeMin;
    document.querySelector("#crypto-volume-input .max").value = cryptos[index].volumeMax;
    
    document.querySelector("#crypto-supply-input .min").value = cryptos[index].supplyMin;
    document.querySelector("#crypto-supply-input .max").value = cryptos[index].supplyMax;
    
    document.querySelector("#crypto-marcap-input .min").value = cryptos[index].marcapMin;
    document.querySelector("#crypto-marcap-input .max").value = cryptos[index].marcapMax;

    // Reveal crypto edit modal
    var cryptoModalEl = document.querySelector("#crypto-edit-modal");
    cryptoModalEl.classList.add("is-active");
}

// Apply changes from crypto edit modal
function confirmCryptoEdits()
{
    // Get list index of active crypto element
    var index = document.querySelector("#select-crypto-list").value;

    // Update pricemin and pricemax
    var cryptoEl = document.querySelector("#crypto-price-input");
    if(cryptoEl.querySelector(".min").value  && !isNaN(parseFloat(cryptoEl.querySelector(".min").value)))
    {
        cryptos[index].priceMin = cryptoEl.querySelector(".min").value;
    }
    else
    {
        cryptos[index].priceMin = "";
    }
    if(cryptoEl.querySelector(".max").value  && !isNaN(parseFloat(cryptoEl.querySelector(".max").value)))
    {
        cryptos[index].priceMax = cryptoEl.querySelector(".max").value;
    }
    else
    {
        cryptos[index].priceMax = "";
    }
    cryptoEl.querySelector(".min").value = "";
    cryptoEl.querySelector(".max").value = "";

    // Update volumemin and volumemax
    cryptoEl = document.querySelector("#crypto-volume-input");
    if(cryptoEl.querySelector(".min").value  && !isNaN(parseFloat(cryptoEl.querySelector(".min").value)))
    {
        cryptos[index].volumeMin = cryptoEl.querySelector(".min").value;
    }
    else
    {
        cryptos[index].volumeMin = "";
    }
    if(cryptoEl.querySelector(".max").value  && !isNaN(parseFloat(cryptoEl.querySelector(".max").value)))
    {
        cryptos[index].volumeMax = cryptoEl.querySelector(".max").value;
    }
    else
    {
        cryptos[index].volumeMax = "";
    }
    cryptoEl.querySelector(".min").value = "";
    cryptoEl.querySelector(".max").value = "";

    // Update supplymin and supplymax
    cryptoEl = document.querySelector("#crypto-supply-input");
    if(cryptoEl.querySelector(".min").value  && !isNaN(parseFloat(cryptoEl.querySelector(".min").value)))
    {
        cryptos[index].supplyMin = cryptoEl.querySelector(".min").value;
    }
    else
    {
        cryptos[index].supplyMin = "";
    }
    if(cryptoEl.querySelector(".max").value  && !isNaN(parseFloat(cryptoEl.querySelector(".max").value)))
    {
        cryptos[index].supplyMax = cryptoEl.querySelector(".max").value;
    }
    else
    {
        cryptos[index].supplyMax = "";
    }
    cryptoEl.querySelector(".min").value = "";
    cryptoEl.querySelector(".max").value = "";

    // Update marcapmin and marcapmax
    cryptoEl = document.querySelector("#crypto-marcap-input");
    if(cryptoEl.querySelector(".min").value  && !isNaN(parseFloat(cryptoEl.querySelector(".min").value)))
    {
        cryptos[index].marcapMin = cryptoEl.querySelector(".min").value;
    }
    else
    {
        cryptos[index].marcapMin = "";
    }
    if(cryptoEl.querySelector(".max").value  && !isNaN(parseFloat(cryptoEl.querySelector(".max").value)))
    {
        cryptos[index].marcapMax = cryptoEl.querySelector(".max").value;
    }
    else
    {
        cryptos[index].marcapMax = "";
    }
    cryptoEl.querySelector(".min").value = "";
    cryptoEl.querySelector(".max").value = "";

    // Update alert symbols
    updateCryptoAlerts();

    // Update crypto table with values
    showOneCrypto(index);

    // Close modal
    closeCryptoEdit();
    saveInvestments();
}

// Close edit crypto modal
function closeCryptoEdit()
{
    var cryptoModalEl = document.querySelector("#crypto-edit-modal");
    cryptoModalEl.classList.remove("is-active");
}