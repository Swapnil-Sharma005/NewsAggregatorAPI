var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var users = require("../data/userinfo");
var validator = require("../helpers/validator");
const path = require("path");
const fs = require("fs");
const { default: axios } = require("axios");
require('dotenv').config();


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
    let user = users.users.filter(val => val.email == userDetails.email);
    if (user.length>0) {
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





module.exports = { registerUser, loginUser };