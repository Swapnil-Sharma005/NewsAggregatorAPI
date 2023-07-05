const express = require("express");
const bodyParser = require("body-parser");
const routes = express.Router();
const userInfo = require("./data/userInfo");

const app = express()
const PORT = 3000;

app.use(routes);
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json);

routes.get('/', (req,res) => {
    res.status(200);
    res.send("Welcome to the News Aggregator API");
});

routes.post('/register', (req,res) => {

})




app.listen(PORT, (error) => {
    if(!error){
        console.log("Server is running");
    }else{
        console.log("Server failed to run");
    }
})