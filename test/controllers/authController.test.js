process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var bcrypt = require('bcrypt');
const sinon  = require('sinon');
const expect = require('chai').expect;
const server = require('../../app.js');
let userData = require('../../data/userinfo.json');

describe('Test the flow of registration', () => {

    let userDetails = {
        username: "test",
        email:"test@gmail.com",
        password:"test123",
        newsPreferencesCategories: "technology"
    };

    it("1. Successfully register a user", (done) => {
        chai.request(server).post('/register').send(userDetails).end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.message).equal("User has been register successfully");
            done();

        });
    })

    it("3. Fails to register User details are missing", (done) => {
        userDetails.email = '';
        chai.request(server).post('/register').send(userDetails).end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.message).equal("User Details are missing");
            done();
        });
    });

    it("4. Fails to register User already present", (done) => {
        userDetails.email = "tp@gmail.com";
        chai.request(server).post('/register').send(userDetails).end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.message).equal("A user is already register with this email id");
            done();
        });
    });
})


describe('Test the login flow', () => {

    it("1. Successfully login", (done) => {
        let userDetails = {
            email:"tp@gmail.com",
            password:"123",
        };
        chai.request(server).post('/login').send(userDetails).end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('accessToken');
            expect(res.body.message).equal("Login Sucessfully");
            expect(res.body.accessToken).to.not.be.empty;
            done();
        });
    });

    it("2. Fails to login user with wrong password", (done) => {
        let userDetails = {
            email:"tp@gmail.com",
            password:"123456",
        };
        chai.request(server).post('/login').send(userDetails).end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body.message).equal("Password is wrong");
            expect(res.body.accessToken).to.be.null;
            done();
        });
    });

    it("3. Fails to login user not found", (done) => {
        let userDetails = {
            email:"test2123@gmail.com",
            password:"test123",
        };
        chai.request(server).post('/login').send(userDetails).end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body.message).equal("User Not found");
            done();
        });
    });
});

