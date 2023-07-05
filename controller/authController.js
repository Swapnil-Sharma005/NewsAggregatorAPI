var jwt = require("jsonwebtoken0");
var bcrypt = require("bcrypt");
var users = require("../data/userInfo");
var validator = require("../helpers/validator");

var registerUser = (req, res) => {
    const userDetails = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        newsPreferencesCategories: req.body.newsPreferencesCategories
      };
    
    if(validate(userDetails)){
        users.push(userDetails);
    }
    else{
        res.send(validate(userDetails));
    }
}
