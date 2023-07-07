var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var users = require("../data/userinfo");
var validator = require("../helpers/validator");
const path = require("path");
const fs = require("fs");
const URLSearchparams = require('url-search-params');
const { default: axios } = require("axios");
require('dotenv').config();

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

var registerUser = (req, res) => {
    const userDetails = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        newsPreferencesCategories: req.body.newsPreferencesCategories
    };

    let writePath = path.join(__dirname, '..', '/data/userinfo.json');
    if (validator.validateUserInfo(userDetails, users).status) {
        let userDataModified = JSON.parse(JSON.stringify(users));
        userDataModified.users.push(userDetails);
        fs.writeFileSync(writePath, JSON.stringify(userDataModified), { encoding: 'utf8', flag: 'w' });
        res.status(200);
        res.json(validator.validateUserInfo(userDetails, users));
    } else {
        res.status(400);
        res.json(validator.validateUserInfo(userDetails, users))
    }
}

var loginUser = (req, res) => {
    const userDetails = req.body;
    //const user = users.users.some(u => u.email === userDetails.email);
    let user = users.users.filter(val => val.email == userDetails.email);
    if (user) {
        var passwordIsValid = bcrypt.compareSync(req.body.password, user[0].password)
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Password is wrong"
            })
        }

        var token = jwt.sign({
            id: user[0].email
        }, process.env.API_SECRET, {
            expiresIn: 86400
        });
        return res.status(200).send({
            message: "Login Sucessfully",
            accessToken: token
        })
    } else {
        return res.status(401).send({
            message: "User Not found"
        })
    }
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
        let resp = await newsFetchPromise(`${url}?${searchParams}&${searchParams2}`);
        console.log(`${url}?${searchParams}?${searchParams2}`);
        res.status(200).json(resp);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};



module.exports = { registerUser, loginUser, userPreferences, userPerferencesUpdate, newsFetch };