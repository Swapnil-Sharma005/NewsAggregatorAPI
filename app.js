const express = require('express');
const bodyParser = require('body-parser');
const routes = express.Router();
const { registerUser, loginUser, userPreferences, userPerferencesUpdate, newsFetch } = require("./controller/authController");
const verifyToken = require('./middleware/authJWT');

const app = express()
const PORT = 3000;

app.use(routes);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

routes.get('/', (req,res) => {
    res.status(200);
    res.send("Welcome to the News Aggregator API");
});

routes.post('/register', registerUser);
routes.post('/login', loginUser);
routes.get('/preferences', verifyToken ,userPreferences);
routes.post('/preferences', verifyToken, userPerferencesUpdate);
routes.get('/news', verifyToken, newsFetch);

app.listen(PORT, (error) => {
    if(!error){
        console.log("Server is running");
    }else{
        console.log("Server failed to run");
    }
})