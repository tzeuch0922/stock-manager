# Stockman

Tony Zeuch and Richard Ay, September 2020

## Table of Contents
* [Project Objective](#project-objective)
* [Acceptance Criteria](#acceptance-criteria)
* [Deployment Link](#deployment-link)
* [Application Logic](#application-logic)
* [Technologies Used](#technologies-used)
* [Application Screen Shot](#application-screen-shot)



## Project Objective
As an investor, I want an application I can start on a device (phone, tablet, computer) that will alert me if monitored investment parameters exceed my defined parameter range.

## Acceptance Criteria
Project requirements include:
1) Use a CSS framework other than Bootstrap.
2) Be deployed to GitHub Pages.
3) Be interactive (i.e., accept and respond to user input).
4) Use at least two server-side APIs.
5) Does not use alerts, confirms, or prompts (use modals).
6) Uses client-side storage to store persistent data.
7) Be responsive.
8) Have a polished UI.
9) Have a clean repository that meets quality coding standards (file structure, naming conventions, follows best practices for class/id naming conventions, indentation, quality comments, etc.).
10) Have a quality README (with unique name, description, technologies used, screenshot, and link to deployed application).
11) Finally, you must add your project to the portfolio that you created in Module 2.

## Deployment Link
The deployment link to display the application web page is: 
[GitHub Pages](https://team-antman-project-1.github.io/stockman/) 

## Application Logic

1) On start-up, local storage is read and if data is acquired, the equity and crypto-currency pages are populated.
2) On the main page the user can define, edit, or delete investments (equities or crypto-currencies).
3) A timer is started that updated the investment information every 10 minutes.  (Only the transitory data is updated by this process.  Other data is only updated once a day after the market closes - this data is not updated by the timer function.)
4) Whenever data is updated, the entire set of investment information is saved to local storage.
5) When the user clicks on an investment, the appropriate page (either equity or crypto-currency) is displayed with the data for that investment.
6) On either the equity page or the crypto-currency page, a drop list is available to switch to other (similar) investments. Whenever an investment is selected, its data is updated and displayed on the page.
7) For each investment, its characteristic parameters are compared to a user defined range.  The HTML page is updated to indicate if the parameters are inside or outside of these defined ranges (by placing icons next to the parameters).  A parameter outside of the specified range deserves additional evaluation on a brokerage website. 

## Technologies Used

1) The HTML framework employed is 'Bulma'.
2) Certain fonts are displayed using 'FontAwesome'.
3) Date and time information is acquired and manipulated via 'moment.js'.
4) Several different public APIs are used to acquire the financial data:
   * AlphaAdvantage.co
   * FinancialModelingPrep.com
   * Finnhub.io
   * nomics.com

## Application Screen Shot

![Stockman Image](https://github.com/Team-Antman-Project-1/stockman/blob/feature/apis/stockman.jpg)

