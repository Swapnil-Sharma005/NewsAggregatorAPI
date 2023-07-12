process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var bcrypt = require('bcrypt');
const sinon  = require('sinon');
const expect = require('chai').expect;

