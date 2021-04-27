# Stock-Hub-TL

Stock-Hub-TL is an all-in-one application to view stock charts and stock news. The user is able to view the price chart of a stock with different time periods and time intervals while also having the ability to retrieve stock articles from multiple media outlets such as Finviz, WSJ, Motley Fool, TradingView and Bloomberg. 

## Deployed App

<a href="https://stock-hub-tl.herokuapp.com/"> Stock-Hub-TL </a>

## Screenshots
![Stock Chart and Stock News](https://stock-hub-tl.s3.amazonaws.com/Home+Recording+-+GIF.gif)
![Stock News](https://stock-hub-tl.s3.amazonaws.com/Stock+News+-+GIF.gif)

## Tech-Stack

The front-end is built using React, Redux, JavaScript, HTML, CSS, D3 and React-Stockcharts. The backend is built with Node and Express. To retrieve stock articles from different media outlets I used Axios.js combined with Cheerio.js and Puppeeteer. For financial data, I used AlphaVantage API for updated stock prices and NASDAQ API for a list of stocks and their corresponding exchange.
