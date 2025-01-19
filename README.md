Project Title: Geopolitical Impact on Stock Portfolios
Project Description
This project integrates with brokers such as Trade Republic to provide end users with timely information about the potential impact of recent geopolitical events on the stocks in their portfolios. It aims to assist individuals who may not have the time to stay updated on significant geopolitical developments, such as blockages in the Suez Canal or increases in gun violence rates, by using graph-based RAG (Retrieval-Augmented Generation) to illustrate the causal relationships between geopolitics and market movements. The project includes a substantial amount of work, which is partially showcased in a 2-minute video.

##  Some quick info: 
* We have two backends, one handles the Graph RAG, the other manages the AI agents to do the stock analysis etc & to streamline information to the UI. We also use tavilyAI for other purposes.
* Our UI is built w/ NUXTjs, which is based on VueJS, and is similar to NextJS.
  

##  How to Run the Project

1. Install Dependencies: Ensure you have Node.js installed, then run the following command to install the necessary packages:
2. Development Server: Start the development server by running:
This will launch the application on http://localhost:3000.
Build for Production: To build the application for production, use:
4. Preview Production Build: To preview the production build locally, execute:
APIs/Tools Used
Vue.js: The project is built using Vue.js, a progressive JavaScript framework for building user interfaces.
D3.js: Utilized for geographical data visualization and manipulation.
Three.js: Used for rendering 3D graphics, particularly for the globe visualization.
Highlight.js: For syntax highlighting in code blocks.
Fetch API: Used for making HTTP requests to the backend services.
OpenStreetMap API: For geocoding location names to coordinates.
Documentation for Review
Code Structure: The project is organized into components, each responsible for a specific part of the application, such as the sidebar, globe visualization, and stock tickers.
Component Details: Key components include Globe.vue for the 3D globe visualization, SidebarHeader.vue for the sidebar navigation, and Tickers.vue for displaying stock information.
Data Flow: The application fetches data from an API endpoint (/api/tavily-search) to retrieve recent events and their potential impact on selected stocks.
Event Handling: The project includes methods for handling user interactions, such as selecting a stock or country, and fetching related events.
For a detailed review, please refer to the code files and their respective logic, particularly focusing on the components and scripts that handle data fetching and visualization.





