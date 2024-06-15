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
            testData.existingAccounts.map((account) => {
                account.password = bcrypt.hashSync(account.password, 8);
            })
            await Account.insertMany(testData.existingAccounts);
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
    });
});