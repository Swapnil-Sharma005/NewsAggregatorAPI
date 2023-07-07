# NewsAggregatorAPI
A RESTful API using Node.js, Express.js, and NPM packages. 
The API will allow users to register, log in, and set their news preferences (e.g., categories, sources).
The API will then fetch news articles from multiple sources using external news APIs (e.g., NewsAPI) according to the user preferences.

EndPoints are:

POST /register: Register a new user.
POST /login: Log in a user.
GET /preferences: Retrieve the news preferences for the logged-in user.
PUT /preferences: Update the news preferences for the logged-in user.
GET /news: Fetch news articles based on the logged-in user's preferences.
