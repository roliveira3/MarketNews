# MarketNews

[[_TOC_]]

## Team Members
1. Roberto Oliveira Pais
2. Ryo Bertolissi
3. Pascal Bucher
4. Pascal Feigenwinter

## Project Description 
Our goal is to build a webpage named 'MarketNews'. It is designed to be simple and easy to use, offering a clear overview of the most important stocks in the current market. We aim to provide an alternative to the more technical pages like [Finviz](https://finviz.com/), by offering a more user-friendly interface. Our focus is on presenting the most important data, leaving the intricate details to the experts. In addition to global market trends, we will integrate news that is specific to companies and stocks. To top it off, we will feature a clean and appealing user interface.

### Project goals
Our page consists of two main pages. The first is a landing page, where we plan to display stocks of the US market. These stocks will be presented in a list of card components, each representing a single stock. On these cards, there will be a quick overview of the stock, including its current price, name, movement in the last day, and a brief graph indicating its current trend.

![](mdmedia/landing_page.png)

We will start by featuring 10 stocks initially to showcase the concept and then plan on expanding the page from there. This expansion includes adding all the stocks of the market, as well as implementing search and filtering functions. Depending on how things progress, we also aim to categorize the stocks and add other minor functionalities.

The second page will be accessible when a user clicks on one of the stocks. It will display a detailed view of the selected stock. This page will feature a candlestick chart showing the stock's movement. To complement this chart, we will include additional important metrics about the stock in a table format below, and possibly a pie chart displaying expert indicators. On the right side, there will also be a section for news related to the company that the stock belongs to. A visual representation of this layout can be seen in the picture below.

![](mdmedia/stock_details.png)

 If there is time, we will make the candle chart more dynamic, use different timeframes and improve the looks of the UI.

### Data Sources
For the data required in our backend, we will utilize the API provided by [Finnhub](https://finnhub.io), which offers a comprehensive range of data, including news articles.
Finnhub has generously allowed us to use their API endpoint for candle data free of charge, a feature that usually incurs a cost and is reserved for premium users.

### Tasks
- The website should offer a straightforward and comprehensive overview of US stocks. The goal is to present the most important information in an easily accessible format, allowing users to quickly understand the essential data at a glance.
- A distinctive feature of the website will be the integration of detailed stock information alongside relevant news on the same page. This functionality is intended to eliminate the need for users to search for news on other websites.

## Requirements
For the backend to work, ensure you have the axios library installed, as it is crucial for connecting to the API. It can be installed using this command:
```bash
npm install axios
```

In the frontend of our application, we utilize two charting libraries to enhance data visualization:
```bash
npm install react-chartjs-2 chart.js
npm install react-apexcharts apexcharts
```

## How to Run
Once all the required packages have been installed, the website is ready for use. It can be launched with the following command:
```bash
npm run dev
```

The data may take a few seconds to fully update from the API. If you encounter any data that appears outdated, simply refresh the page.

Open the webbrowser on http://localhost:5173/ , please use Google-Chrome for this, since everything was developed and tested on it. It should work for other broweser, but there may be some CSS bugs.

The deployment is currently not working (although it passes all pipelines), this was discussed via Mail with the lecturer on the 21 and 22.12.2023. Since he could not help us and Matthias Gabathuler is/was on holidays it was decided that the local the above steps to run the code locally are enough. It was decided (by David Sichau) to take on the matter after Christmas break. Further you find a video of the steps how to run in a video along with what the page looks like (this was requested by one of the TA's) in the mdmedia file (DemovideoWebiste). The Application is made for laptop users, but as shown in the videos, it is scalable to some bit. 

Inside the `server/constants.ts` file, there are two important constants: `UPDATES_ENABLED` and `DEBUG_MODE`, both initially set to true by default. The `UPDATES_ENABLED` constant determines whether the server data should be periodically refreshed with information from the API. If `DEBUG_MODE` is set to true, the server will displays these updates by outputting each update event to the console.

You can personalize the displayed stocks by modifying the `server/data/stocks.json` file. If updates are enabled, altering the topStocks list – either by adding, editing, or deleting stock symbols – will update the stock overview on the landing page. Additionally, new stock data will be retrieved from the API corresponding to these changes.
Please be aware that the API restricts us to a maximum of 60 calls per minute. Retrieving complete information for each stock, including the current price, metrics, candle data, and more, needs several API calls. Therefore, adding more stocks could result in outdated stock data or, in some cases, failure to load any data at all.



### Local Development

Only change files inside the `src` directory.

**Client side**

All client side files are located in the `src/client` directory.

**Server side**

All server side files are located in the `src/server` directory.

### Local Testing

**run container for local testing**

```bash
docker build -t my-webapp .

docker run -it --rm -p 5173:5173 my-webapp
```
Open a browser and connect to http://localhost:5173

**run bash in interactive container**
```bash
docker build -t my-webapp src/.

docker run -it --rm -p 5173:5173 my-webapp bash
```


## Milestones
Document here the major milestones of your code and future planned steps.
- [x] Planning and creating a layout
  - [x] Created wireframes for the layout of the page and discussed what is on the page
  - [x] Split the work of the page to the according teammembers, summarised: [here](./mdmedia/Outlay.pdf)

- [x] Create Simple Page with 10 stocks for the layout and some Mockdata
  - [x] Create Mockdata Backend for the pages
  - [x] Implement landing page with ca 10 stocks: [see](course-fwe2023/students/project/express/roliveir_project_express#2)
  - [x] Create the detailed stock page for one stock

- [x] Create First Prototype for the Milestone Update
  - [x] Finish detailed stock Page
  - [x] Implement searching function
  - [x] Finish Backend with variables to turn server on and off

- [x] fix all Minor Issues according to update
  - [x] [Issue 11](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/roliveir_project_express/-/issues/11)
  - [x] [Issue 12](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/roliveir_project_express/-/issues/12)
  - [x] [Issue 13](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/roliveir_project_express/-/issues/13)
  - [x] [Issue 14](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/roliveir_project_express/-/issues/14)
  - [x] [Issue 15](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/roliveir_project_express/-/issues/15)
  - [x] [Issue 16](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/roliveir_project_express/-/issues/16)
  - [x] [Issue 17](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/roliveir_project_express/-/issues/17)
  - [x] [Issue 18](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/roliveir_project_express/-/issues/18)
  - [x] [Issue 19](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/roliveir_project_express/-/issues/19)
  - [x] [Issue 20](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/roliveir_project_express/-/issues/20)
  - [x] [Issue 21](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/roliveir_project_express/-/issues/21)
  - [x] [Issue 22](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/roliveir_project_express/-/issues/22) 

## Weekly Summary 

#### Week 1:

During the online group meeting on 14.11, team members presented their project ideas. A poll was conducted to determine the top two ideas to work on, establishing a backup plan in case the primary idea (market news) was denied. Two subgroups were formed to develop each idea further, with a focus on researching libraries and APIs. 
On 17.11, an in-person meeting was held to decide on the project to pitch. Project goals were outlined then presented to the TA.

#### Week 2:

Team meeting in person on 23.11 to work on a mock design, defining minimal functions and color schemes.
Tasks were allocated among team members. Skeleton and some Basic CSS were added.

#### Week 3:

Mock Data were made accessible in the backend. 
Stock Table on the Landing Page was created.
After some initial commits, we faced in the instructions, that we should work with issues.\
The News component was roughly designed on the detailed stock page.\
Working on the Candle Charts and Stock pages began.\
Landing Page and Detailed Page were done.
Prepared our Page for the Milestone Update. We got really far. See summary below.

#### Milestone Update Summary:

After that we've developed a stable version of the website. We've made significant progress, with most of the page's logic and the backend complete. However, we realized that we must limit the number of stocks featured on our page. Our current API limitations restrict us to 60 calls per minute, and since we need to fetch each stock individually, requiring multiple fetches per stock for all the necessary data, we are constrained in our capacity.

We considered slowing down the fetch rate to update the stocks less frequently, which would allow us to include a few more stocks. However, to cover all stocks, we would need to significantly slow down our update frequency, which would detract from the 'live' feel of the page and require continuous server operation. Therefore, we decided to feature 10 stocks for now, potentially increasing to 20 in the future. This number should be sufficient for a proof of concept.

Scaling up the project would simply involve adding a complete list of stocks to the server and adjusting the update frequency. The rest of the system is designed to scale automatically. Thus, the only current limitation is the API's capacity.

The page presented (see Milestone 2 Tag) got really positive Feedback. As said we are mostly done and just need to add some small styling things and a few small components to make the page easier to understand for someone new to stocks and the backend for the little Graph on the landing Page. We created a list of issues for this [see here](https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/roliveir_project_express/-/issues) and Milestones above.

After this we are pretty much done with the page. If there is time we will add some more small functionalities. However, we are currently quite busy (that's why we have done so much already) so we will see. 

#### Week 4

We each focused on addressing our respective issues. At the end of the week, we will summarize which issues were resolved.

End of week update:\
We've added tooltips that appear when users hover over key data points, providing explanations for each. The page now looks acceptable on most screen sizes, but we've primarily optimized it for laptop users. This is because adapting the CSS for different screen sizes is extra work that we've chosen to minimize. While it works on all devices, the layout is best suited for a laptop display.

The detailed stock page is nearly complete, with only minor tweaks pending. We still need to add the graphs to the main page, but apart from that, our work is almost done. The remaining tasks include cleaning up the code, adding comments, and addressing some outstanding 'to-do' items.

#### Week during Hand-in

Ryo has successfully implemented the graph on the main page. We've achieved some degree of scalability across different devices; the page works well on iPads and, while not optimized for mobile phones, nothing appears to be broken on smaller screens, even though the user experience may not be ideal. Additionally, we've introduced an info button on the main page.

However, we are still ironing out a few issues. There's a minor bug causing the title to clip on the detailed page. Also, one team member is encountering some unexpected behavior with the trends graph on the detailed page.

Update: Every bug is now fixed and everything is finalised. There is one very strange behaviour on one of the group members laptops where the piechart gradually becomes smaller when interacting with it. We tried a lot of different apporaches, none of which worked. So we eventually figured it was something device specific, since it worked perfectly for all other group members. We cleaned the code a bit up and you can see the final Version in the Milestone 3 Tag below. After that, there was just changes made to the readme, the code was not changed after 20.12.2023.


## Versioning
Create stable versions of your code each week by using gitlab tags.\
Take a look at [Gitlab Tags](https://docs.gitlab.com/ee/topics/git/tags.html) for more details. 

Then list here the weekly tags. \
We will evaluate your code every week, based on the corresponding version.

Tags:
- Milestone 1: https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/roliveir_project_express/-/tags/Standing_Week_1
- Milestone 2 (Presented in the Milestone update):https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/roliveir_project_express/-/tags/Version-before-Milestone-Update
- Milestone 3: https://gitlab.inf.ethz.ch/course-fwe2023/students/project/express/roliveir_project_express/-/tags/Final_Version
