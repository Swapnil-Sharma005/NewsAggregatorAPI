const jwt = require('jsonwebtoken');
var users = require('../data/userinfo');

const verifyToken = (req, res, next) => {

    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0]=='JWT'){
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET, function(error, decode){
            if(error){
                req.user = undefined;
                next();
            }
            let user = users.users.filter(val => val.email == decode.id);
            req.user = user[0];
            next();
        })
    }
    else{
        req.user = undefined;
        req.message = "Authorization Header is not Found";
        next();
    }
}

module.exports = verifyToken;