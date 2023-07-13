const expect = require('chai').expect;
const validator = require('../../helpers/validator')
const userData = require('../../data/userinfo.json');

let userDetails = {
    username: "test",
    email:"test2@gmail.com",
    password:"test123",
    newsPreferencesCategories: "technology"
}

describe('Testing the flow of validateUserInfo function', function(){
    it('1. Validate the User Details', function(done){
        let response = validator.validateUserInfo(userDetails, userData);
        expect(response.status).equals(true);
        expect(response.message).equals('User has been register successfully');
        done();
    })

    it('2. User already found in the database', function(done){
        userDetails.email = "tp@gmail.com";
        let response = validator.validateUserInfo(userDetails, userData);
        expect(response.status).equals(false);
        expect(response.message).equals('A user is already register with this email id');
        done();
    })

    it('3. User Details are missing', function(done){
        userDetails.email = '';
        let response = validator.validateUserInfo(userDetails, userData);
        expect(response.status).equals(false);
        expect(response.message).equals('User Details are missing');
        done();
    })
})
