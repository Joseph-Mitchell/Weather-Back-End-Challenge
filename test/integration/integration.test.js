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
            await testData.existingAccounts.forEach((account) => {
                account = {...account};          
                account.password = bcrypt.hashSync(account.password, 8);
                testDataEncrypted.push(account);
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
                .send({ password: testPass });
             
            //Assert
            assert.equal(actualResponse.status, 401);
            assert.equal(actualResponse.body.message, "No token provided");
        });
        
        it("should respond 401 if request has unrecognized token", async () => {
            //Arrange
            encryptedId = "hjytrd";
            
            //Act
            const actualResponse = await requester
                .put("/changepass")
                .send({ password: testPass })
                .set("x-access-token", encryptedId);
             
            //Assert
            assert.equal(actualResponse.status, 401);
            assert.equal(actualResponse.body.message, "Token not recognized");
        });
        
        it("should respond 500 if database is offline", async () => {
            //Arrange
            database.close();
            
            //Act
            const actualResponse = await requester
                .put("/changepass")
                .send({ password: testPass })
                .set("x-access-token", encryptedId);
             
            //Assert
            assert.equal(actualResponse.status, 500);
            
            //Cleanup
            await database.connect();
        });
        
        it("should respond 404 if request has no matching id", async () => {
            //Arrange
            encryptedId = jwt.sign("666eb3347fddf9131e9fe94d", process.env.SECRET);
            
            //Act
            const actualResponse = await requester
                .put("/changepass")
                .send({ password: testPass })
                .set("x-access-token", encryptedId);
             
            //Assert
            assert.equal(actualResponse.status, 404);
        });
    });
    
    describe("Get Favourites", () => {
        let dbAccount;
        let encryptedId;
        let actualResponse;
        let actualAccount;
        
        beforeEach(async () => {
            dbAccount = await Account.findOne({ email: testData.existingAccounts[0].email });
            encryptedId = jwt.sign(dbAccount._id.toString(), process.env.SECRET);
        });
        
        afterEach(() => {
            dbAccount = undefined;
            encryptedId = undefined;
            actualResponse = undefined;
            actualAccount = undefined;
        });
        
        it("should respond 200 in normal circumstances", async () => {
            //Act
            actualResponse = await requester
                .get("/favourites")
                .set("x-access-token", encryptedId);
             
            //Assert
            assert.equal(actualResponse.status, 200);
            
            let responseWithoutIds = [];
            actualResponse.body.forEach((favourite) => {
                let { _id, ...fav } = favourite;
                responseWithoutIds.push(fav);
            });
            assert.deepEqual(responseWithoutIds, testData.existingAccounts[0].favourites);
        });
        
        it("should respond 500 if database is disconnected", async () => {
            //Arrange
            database.close();
            
            //Act
            actualResponse = await requester
                .get("/favourites")
                .set("x-access-token", encryptedId);
             
            //Assert
            assert.equal(actualResponse.status, 500);
            
            //Cleanup
            await database.connect();
        });
        
        it("should respond 404 if user not found", async () => {
            //Arrange
            encryptedId = jwt.sign("666eb3347fddf9131e9fe94d", process.env.SECRET);
            
            //Act
            actualResponse = await requester
                .get("/favourites")
                .set("x-access-token", encryptedId);
             
            //Assert
            assert.equal(actualResponse.status, 404);
        });
    });
    
    describe("Add Favourite", () => {
        let dbAccount;
        let encryptedId;
        let actualResponse;
        let actualAccount;
        let testFavourite;
        
        beforeEach(async () => {
            dbAccount = await Account.findOne({ email: testData.existingAccounts[0].email });
            encryptedId = jwt.sign(dbAccount._id.toString(), process.env.SECRET);
            
            testFavourite = {
                "name": "Test",
                "lat": 50,
                "lon": -50,
                "country": "TT",
                "state": "Test"
            };
        });
        
        afterEach(() => {
            dbAccount = undefined;
            encryptedId = undefined;
            actualResponse = undefined;
            actualAccount = undefined;
        });
        
        it("should respond 204 in normal conditions", async () => {
            //Act
            actualResponse = await requester
                .put("/favourites/add")
                .send({ favourite: testFavourite })
                .set("x-access-token", encryptedId);
             
            //Assert
            assert.equal(actualResponse.status, 204);
        });
        
        it("should respond 500 if database is disconnected", async () => {
            //Arrange
            database.close();
            
            //Act
            actualResponse = await requester
                .put("/favourites/add")
                .send({ favourite: testFavourite })
                .set("x-access-token", encryptedId);
             
            //Assert
            assert.equal(actualResponse.status, 500);
            
            //Cleanup
            await database.connect();
        });
        
        it("should respond 404 if no matching account found", async () => {
            //Arrange
            encryptedId = jwt.sign("666eb3347fddf9131e9fe94d", process.env.SECRET);

            
            //Act
            actualResponse = await requester
                .put("/favourites/add")
                .send({ favourite: testFavourite })
                .set("x-access-token", encryptedId);
             
            //Assert
            assert.equal(actualResponse.status, 404);
        });
    });
    
    describe("Remove Favourite", () => {
        let dbAccount;
        let encryptedId;
        let actualResponse;
        let actualAccount;
        let testLat;
        let testLon;
        
        beforeEach(async () => {
            dbAccount = await Account.findOne({ email: testData.existingAccounts[0].email });
            encryptedId = jwt.sign(dbAccount._id.toString(), process.env.SECRET);
            
            testLat = testData.existingAccounts[0].favourites[0].lat;
            testLon = testData.existingAccounts[0].favourites[0].lon;
        });
        
        afterEach(() => {
            dbAccount = undefined;
            encryptedId = undefined;
            actualResponse = undefined;
            actualAccount = undefined;
        });
        
        it("should respond 204 in normal circumstances", async () => {
            //Act
            actualResponse = await requester
                .put("/favourites/remove")
                .send({ lat: testLat, lon: testLon })
                .set("x-access-token", encryptedId);
             
            //Assert
            assert.equal(actualResponse.status, 204);
        });
                
        it("should respond 500 if the database is disconnected", async () => {
            //Arrange
            database.close();
            
            //Act
            actualResponse = await requester
                .put("/favourites/remove")
                .send({ lat: testLat, lon: testLon })
                .set("x-access-token", encryptedId);
             
            //Assert
            assert.equal(actualResponse.status, 500);
            
            //Cleanup
            await database.connect();
        });
    });
});