//////////////////////////////////////////////////////////////
//                  Global Variables                        //
//////////////////////////////////////////////////////////////

// Global data arrays
var stock = [];
var cryptos = [];

// Global variables
var dailyCheckStocks;    // if "true", the daily parameters have been obtained, no need to request again.
var checkSymbol;         // symbol for the "alert" columns

// Button queries
var tabListEl = document.querySelector("#tab-list");
var activeTab = document.querySelector("#general-tab");
var modalCloseBtnEl = document.querySelector("#error-close");

// Event listeners
modalCloseBtnEl.addEventListener("click", closeModal);

// Constant alert icons
var errorIconSm = '<i style="color:blue" class="fas fa-question-circle fa-lg"></i>';
var alertIconSm = '<i style="color:crimson" class="fas fa-exclamation-triangle fa-lg"></i>';
var checkIconSm = '<i style="color:green" class="fas fa-check-circle fa-lg"></i>';
var errorIcon = '<i style="color:blue" class="fas fa-question-circle fa-2x"></i>';
var alertIcon = '<i style="color:crimson" class="fas fa-exclamation-triangle fa-2x"></i>';
var checkIcon = '<i style="color:green" class="fas fa-check-circle fa-2x"></i>';

//////////////////////////////////////////////////////////////
//                  Page Update Functions                   //
//////////////////////////////////////////////////////////////

// Closes error modal
function closeModal()
{
    // Query for error modal.
    var errorModalEl = document.querySelector("#error-modal");
    
    // Remove active from modal
    errorModalEl.classList.remove("is-active");
}

// Change tabs event listener
tabListEl.addEventListener("click", function(event)
{
    // Getting list element that was clicked on.
    var affectedEl = event.target.parentElement;

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

// Check to see if values are within range to set proper alarm icon.
verifyInvestmentItem = function( value, valueMin, valueMax ) 
{
    // Need to make sure both min/max values are defined.
    if( (valueMin !== "" && value < valueMin)  ||  (valueMax !== "" && value > valueMax) ) 
    {
        return alertIcon;
    }
    else if( valueMin === ""  &&  valueMax === "" ) 
    {
        return errorIcon;
    }
    else 
    {
        return checkIcon;
    }
}

//////////////////////////////////////////////////////////////
//                  Persistence Functions                   //
//////////////////////////////////////////////////////////////

// Function to see if a day has passed since last save and save current day to storage.
var getCurrentDay = function() 
{
    // Get the current day 
    var today = moment().format( 'L' );

    // Try to retrieve the date from local storage. 
    var earlierDate = localStorage.getItem( "savedDate" );

    // If the earlierDate exists, compare it to the current date.  If the dates match, set
    // the flag indicating today's "daily" data has been obtained.  If the date doesn't 
    // match set the flag indicating today's daily data has not been obtained.

    if( earlierDate ) 
    {
        if( today === earlierDate ) 
        {
            dailyCheckStocks  = true;
            return;      
        }
        else 
        {
            dailyCheckStocks  = false;
        }
    }

    // For no earlier date, or a different date, save the current date to local storage
    // for the next time this application is run.

    localStorage.setItem( "savedDate", today );
}

// Function to save the investment data to local storage.
var saveInvestments = function() 
{
    // Save the array of stock objects
    localStorage.setItem( "investmentStocks", JSON.stringify( stock ) );

    // save the array of cryptocurrency objects
    localStorage.setItem( "investmentCryptos", JSON.stringify( cryptos ) );
}

// Function to load the investment data from local storage
var retrieveInvestments = function() 
{
    // Retrieve the array of stock objects
    var stocksRead = [];
    stocksRead     = JSON.parse( localStorage.getItem( "investmentStocks" ) );

    if( stocksRead != null ) {
        stock = stocksRead;
    }

    // Retrieve the array of cryptocurrency objects
    var cryptosRead = [];
    cryptosRead     = JSON.parse( localStorage.getItem( "investmentCryptos" ) );

    if( cryptosRead != null ) 
    {
        cryptos = cryptosRead;
    }
}

// play sound
function playSound()
{
    var audio = new Audio('alarm07.wav');
    audio.play();
}