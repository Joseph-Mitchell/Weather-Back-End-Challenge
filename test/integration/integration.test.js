import { describe, it } from "mocha";

import Config from '../../src/config/Config.js';
import Server from "../../src/server/Server.js";
import Database from "../../src/database/Database.js";
import AccountRouter from '../../src/routers/Account.router.js';
import AccountController from '../../src/controllers/Account.controller.js';
import AccountService from '../../src/services/Account.service.js';
import Account from '../../src/models/Account.model.js';

import * as testData from "../data/testAccounts.js";
import { assert } from "chai";
import supertest from "supertest";
import * as bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

describe("Integration Tests", () => {
    let server;
    let database;
    let requester;
    
    before(async () => {
        Config.load();
        const { PORT, HOST, DB_URI } = process.env;

        const router = new AccountRouter(new AccountController(new AccountService()));

        server = new Server(PORT, HOST, router);
        database = new Database(DB_URI);

        server.start();
        await database.connect();
        
        requester = supertest(server.getApp());
    });
    
    after(async () => {
        server.close();
        await database.close();
    });
    
    beforeEach(async () => {
        try {
            await Account.deleteMany();
        } catch (e) {
            console.log(e.message);
            throw new Error();
        }
        try {
            let testDataEncrypted = [];
            testData.existingAccounts.forEach((account) => {
                testDataEncrypted.push({ email: account.email, password: bcrypt.hashSync(account.password, 8) });
            });
            await Account.insertMany(testDataEncrypted);
        } catch (e) {
            console.log(e.message);
            throw new Error();
        }
    });
    
    describe("register account", () => {
        it("should respond 201 to valid request", async () => {
            //Act
            const actual = await requester.post("/register").send(testData.newAccounts.valid);
            
            //Assert
            assert.equal(actual.status, 201);
        });
        
        it("should add account to database when request valid", async () => {
            //Act
            await requester.post("/register").send(testData.newAccounts.valid);
            const actual = await Account.findOne({ email: testData.newAccounts.valid.email });
            
            //Assert
            assert.isNotNull(actual);
        });
        
        it("should hash password when adding account", async () => {
            //Act
            await requester.post("/register").send(testData.newAccounts.valid);
            const actual = await Account.findOne({ email: testData.newAccounts.valid.email });
            
            //Assert
            assert.isOk(bcrypt.compareSync(testData.newAccounts.valid.password, actual.password));
        });
        
        it("should respond 400 with no body in response", async () => {
            //Act
            const actual = await requester.post("/register");
            
            //Assert
            assert.equal(actual.status, 400);
        });
        
        it("should respond 400 with invalid email", async () => {
            //Act
            const actual = await requester.post("/register").send(testData.newAccounts.invalidEmail);
            
            //Assert
            assert.equal(actual.status, 400);
        });
        
        it("should respond 400 with empty email", async () => {
            //Act
            const actual = await requester.post("/register").send(testData.newAccounts.emptyEmail);
            
            //Assert
            assert.equal(actual.status, 400);
        });
        
        it("should respond 400 with missing email", async () => {
            //Act
            const actual = await requester.post("/register").send(testData.newAccounts.missingEmail);
            
            //Assert
            assert.equal(actual.status, 400);
        });
        
        it("should respond 400 with empty password", async () => {
            //Act
            const actual = await requester.post("/register").send(testData.newAccounts.emptyPassword);
            
            //Assert
            assert.equal(actual.status, 400);
        });
        
        it("should respond 400 with missing password", async () => {
            //Act
            const actual = await requester.post("/register").send(testData.newAccounts.missingPassword);
            
            //Assert
            assert.equal(actual.status, 400);
        });
        
        it("should respond 500 if database offline", async () => {
            //Arrange
            await database.close();
            
            //Act
            const actual = await requester.post("/register").send(testData.newAccounts.valid);
            
            //Assert
            assert.equal(actual.status, 500);
            
            //Cleanup
            await database.connect()
        });
        
        it("should respond 409 if account with matching email already exists", async () => {
            //Act
            const actual = await requester.post("/register").send(testData.newAccounts.sameEmail);
            
            //Assert
            assert.equal(actual.status, 409);
        });
    });
    
    describe("login", () => {
        it("should respond 201 to valid request", async () => {
            //Act
            const actual = await requester.post("/login").send(testData.existingAccounts[0]);

            //Assert
            assert.equal(actual.status, 200);
            assert.isOk(jwt.verify(actual.body.token, process.env.SECRET))
        });
        
        it("should respond 400 with no body in response", async () => {
            //Act
            const actual = await requester.post("/login");
            
            //Assert
            assert.equal(actual.status, 400);
        });
        
        it("should respond 500 if database offline", async () => {
            //Arrange
            await database.close();
            
            //Act
            const actual = await requester.post("/login").send(testData.existingAccounts[0]);            
            
            //Assert
            assert.equal(actual.status, 500);
            
            //Cleanup
            await database.connect()
        });
        
        it("should respond 404 if account could not be found", async () => {
            //Act
            const actual = await requester.post("/login").send(testData.newAccounts.valid);

            //Assert
            assert.equal(actual.status, 404);
        });
    });
    
    describe("change password", () => {
        
        let testPass;
        let dbAccount;
        let encryptedId;
        let actualResponse;
        let actualAccount;
        
        beforeEach(async () => { 
            testPass = "newPass";
            dbAccount = await Account.findOne({ email: testData.existingAccounts[0].email });
            encryptedId = jwt.sign(dbAccount._id.toString(), process.env.SECRET);
        });
        
        afterEach(() => {
            testPass = undefined;
            dbAccount = undefined;
            encryptedId = undefined;
            actualResponse = undefined;
            actualAccount = undefined;
        });
        
        it("should respond 204 to a valid request", async () => {
            //Act
            actualResponse = await requester
                .put("/changepass")
                .send({ password: testPass })
                .set("x-access-token", encryptedId);

            actualAccount = await Account.findById(dbAccount._id);
             
            //Assert
            assert.equal(actualResponse.status, 204);
            assert.isOk(bcrypt.compareSync(testPass, actualAccount.password));
        });
        
        it("should respond 401 if request has no token", async () => {
            //Act
            const actualResponse = await requester
                .put("/changepass")
                .send({ password: testPass })
             
            //Assert
            assert.equal(actualResponse.status, 401);
        })
    });
});