const { default: axios } = require("axios");
const redis = require('redis');
const URLSearchparams = require('url-search-params');
var users = require("../data/userinfo");
var validator = require("../helpers/validator");
const path = require("path");
const fs = require("fs");
const {promisify} = require('util');

const client = redis.createClient();

const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.set).bind(client);



let url = "https://newsapi.org/v2/everything";

function newsFetchPromise(url) {
    return new Promise((resolve, reject) => {
      axios.get(url).then(resp => {
        return resolve(resp.data);
      }).catch(err => {
        return reject(err);
      });
    });
  }

  var userPreferences = (req, res) => {

    if (!req.user && req.message == null) {
        res.status(403).send({
            message: "Invalid JWT token"
        });
    }
    else if (!req.user || req.message) {
        res.status(403).send({
            message: req.message
        });
    }
    const user = req.user;
    res.status(200).send({
        message: "News preferences of the logged in user are: " + user.newsPreferencesCategories
    })
}

var userPerferencesUpdate = (req, res) => {
    if (!req.user && req.message == null) {
        res.status(403).send({
            message: "Invalid JWT token"
        });
    }
    else if (!req.user || req.message) {
        res.status(403).send({
            message: req.message
        });
    }
    let writePath = path.join(__dirname, '..', '/data/userinfo.json');
    let userDataModified = JSON.parse(JSON.stringify(users));
    const userIndex = users.users.indexOf(req.user);

    req.user.newsPreferencesCategories = req.body.newsPreferencesCategories

    userDataModified.users.splice(userIndex, 1, req.user);
    fs.writeFileSync(writePath, JSON.stringify(userDataModified), { encoding: 'utf8', flag: 'w' });
    res.status(200);
    res.send("Preferences has been updated");

}

var newsFetch = async (req, res) => {
    if (!req.user && req.message == null) {
        res.status(403).send({
            message: "Invalid JWT token"
        });
    }
    else if (!req.user || req.message) {
        res.status(403).send({
            message: req.message
        });
    }

    let preferences = req.user.newsPreferencesCategories;
    const searchParams = new URLSearchparams({ q: preferences });
    let apiKey = 'b4952a9084644ceead76ec4fe498e28e';
    const searchParams2 = new URLSearchparams({ apiKey: apiKey });
    try {
        const reply = await GET_ASYNC('news');
        if(reply){
            console.log('using cached data');
            res.send(JSON.parse(reply));
            return
        }
        let resp = await newsFetchPromise(`${url}?${searchParams}&${searchParams2}`);
        const saveResult = await SET_ASYNC(
            'news',
            JSON.stringify(resp.data),
            'EX',
            300     //caching expiration timing set to 5 min.
        )
        res.status(200).json(resp);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};



module.exports = {userPreferences, userPerferencesUpdate, newsFetch };

