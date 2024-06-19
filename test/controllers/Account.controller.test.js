import { beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import AccountController from "../../src/controllers/Account.controller.js";
import { assert } from "chai";
import Config from "../../src/config/Config.js";

describe("Controller", () => {
    let stubbedService;
    let stubbedResponse;
    let testController;
    let testAccount;
    let testAccountEncrypted;
    let testRequest;
    let testFavourites;

    describe("addAccount", () => {
        beforeEach(() => {
            stubbedService = { findAccountByEmail: sinon.stub(), addAccount: sinon.stub() };
            stubbedResponse = { status: sinon.stub().returnsThis(), json: sinon.stub() };
            
            testController = new AccountController(stubbedService);
            testAccount = { _id: "1", email: "test@email.com", password: "testPass" };
            testRequest = { body: testAccount };
            
            stubbedService.findAccountByEmail.resolves(null);
            stubbedService.addAccount.resolves(testAccount);
        });
        
        afterEach(() => {
            stubbedService = undefined;
            stubbedService = undefined;
            stubbedResponse = undefined;
            stubbedResponse = undefined;
            testController = undefined;
            testAccount = undefined;
        });
        
        it("should call res.status with 201 and res.json with account Object", async () => {
            //Act
            await testController.addAccount(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 201);
            sinon.assert.calledWith(stubbedResponse.json, { id: testAccount._id, email: testAccount.email });
        });
        
        it("should call res.status with 500 if findAccountByEmail rejects", async () => {
            //Arrange       
            stubbedService.findAccountByEmail.rejects(new Error());
            
            //Act
            await testController.addAccount(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 500);
        });
        
        it("should call res.status with 409 if findAccountByEmail doesn't null", async () => {
            //Arrange       
            stubbedService.findAccountByEmail.resolves({});
            
            //Act
            await testController.addAccount(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 409);
        });
        
        it("should call res.status with 400 if req does not have body key", async () => {
            //Arrange       
            testRequest = {};
            
            //Act
            await testController.addAccount(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 400);
        });
        
        it("should call res.status with 500 if addAccount rejects", async () => {
            //Arrange       
            stubbedService.addAccount.rejects(new Error());
            
            //Act
            await testController.addAccount(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 500);
        });
        
        it("should call res.status with 400 if addAccount resolved value does not have _id key", async () => {
            //Arrange       
            testAccount._id = undefined;
            
            //Act
            await testController.addAccount(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 400);
        });
    });
    
    describe("login", () => {
        beforeEach(() => {
            stubbedService = { findAccountByEmail: sinon.stub() };
            stubbedResponse = { status: sinon.stub().returnsThis(), json: sinon.stub() };
            
            testController = new AccountController(stubbedService);
            testAccount = { _id: "1", email: "test@email.com", password: "testPass" };
            testAccountEncrypted = { _id: "1", email: "test@email.com", password: bcrypt.hashSync("testPass", 8) };
            testRequest = { body: testAccount };
            
            stubbedService.findAccountByEmail.resolves(testAccountEncrypted);
        });
        
        afterEach(() => {
            stubbedService = undefined;
            stubbedService = undefined;
            stubbedResponse = undefined;
            stubbedResponse = undefined;
            testController = undefined;
            testAccount = undefined;
            testAccountEncrypted = undefined;
        });
        
        it("should call res.status with 200 and res.json encoded _id", async () => {
            Config.load();
            
            //Act
            await testController.login(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 200);
            assert.equal(jwt.verify(stubbedResponse.json.getCall(0).args[0].token, process.env.SECRET).id, testAccount._id);
        });
        
        it("should call res.status with 500 if findAccountByEmail rejects", async () => {
            //Arrange       
            stubbedService.findAccountByEmail.rejects(new Error());
            
            //Act
            await testController.login(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 500);
        });
        
        it("should call res.status with 400 if req does not have body key", async () => {
            //Arrange       
            testRequest = {};
            
            //Act
            await testController.login(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 400);
        });
        
        it("should call res.status with 404 if findAccountByEmailAndPass resolved value does not have _id key", async () => {
            //Arrange       
            testAccount = null;
            stubbedService.findAccountByEmail.resolves(testAccount);
            
            //Act
            await testController.login(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 404);
        });
    });
    
    describe("changePassword", () => {
        
        beforeEach(() => {
            stubbedService = { updateAccountPassword: sinon.stub() };
            stubbedResponse = { status: sinon.stub().returnsThis(), json: sinon.stub() };
            
            testController = new AccountController(stubbedService);
            testAccount = { _id: "1", email: "test@email.com", password: "testPass" };
            testAccountEncrypted = { _id: "1", email: "test@email.com", password: bcrypt.hashSync("testPass", 8) };
            testRequest = {
                body: {
                    id: testAccount._id,
                    password: "epic"
                }
            };
            
            stubbedService.updateAccountPassword.resolves(testAccountEncrypted);
        });
        
        afterEach(() => {
            stubbedService = undefined;
            stubbedService = undefined;
            stubbedResponse = undefined;
            stubbedResponse = undefined;
            testController = undefined;
            testAccount = undefined;
            testAccountEncrypted = undefined;
        });
        
        it("should respond with 204 in normal circumstances", async () => {            
            //Act
            await testController.changePassword(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 204);
        });
            
        it("should respond with 400 if no body in request", async () => {
            //Arrange
            testRequest = {};
            
            //Act
            await testController.changePassword(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 400);
        });
        
        it("should respond with 500 if updateAccountPassword rejects", async () => {
            //Arrange
            stubbedService.updateAccountPassword.rejects(new Error());
            
            //Act
            await testController.changePassword(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 500);
        });
        
        it("should respond with 404 if updateAccountPassword resolves null", async () => {
            //Arrange
            stubbedService.updateAccountPassword.resolves(null);
            
            //Act
            await testController.changePassword(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 404);
        });
    });
    
    describe("getFavourites", () => {
        
        beforeEach(() => {
            stubbedService = { findAccountById: sinon.stub() };
            stubbedResponse = { status: sinon.stub().returnsThis(), json: sinon.stub() };
            
            testController = new AccountController(stubbedService);
            testFavourites = [
                {
                    "name": "London",
                    "lat": 51.5073219,
                    "lon": -0.1276474,
                    "country": "GB",
                    "state": "England"
                },
                {
                    "name": "Glasgow",
                    "lat": 55.8609825,
                    "lon": -4.2488787,
                    "country": "GB",
                    "state": "Scotland"
                },
            ];
            testAccount = {
                _id: "1",
                email: "test@email.com",
                password: "testPass",
                favourites: testFavourites
            };
            testRequest = {
                body: {
                    id: testAccount._id,
                }
            };
            
            stubbedService.findAccountById.resolves(testAccount);
        });
        
        afterEach(() => {
            stubbedService = undefined;
            stubbedService = undefined;
            stubbedResponse = undefined;
            stubbedResponse = undefined;
            testController = undefined;
            testAccount = undefined;
            testFavourites = undefined;
        });
        
        it("should respond with 200 in normal circumstances", async () => {
            //Act
            await testController.getFavourites(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 200);
            sinon.assert.calledOnceWithExactly(stubbedResponse.json, testFavourites);
        });
        
        it("should respond with 200 when account has no favourites", async () => {
            //Arrange
            testFavourites = [];
            testAccount.favourites = testFavourites;
            
            //Act
            await testController.getFavourites(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 200);
            sinon.assert.calledOnceWithExactly(stubbedResponse.json, testFavourites);
        });
        
        it("should respond with 400 if request has no body", async () => {
            //Arrange
            testRequest = {};
            
            //Act
            await testController.getFavourites(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 400);
        });
        
        it("should respond with 500 if findAccountById rejects", async () => {
            //Arrange
            stubbedService.findAccountById.rejects(new Error());
            
            //Act
            await testController.getFavourites(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 500);
        });
        
        it("should respond with 404 if findAccountById resolves null", async () => {
            //Arrange
            stubbedService.findAccountById.resolves(null);
            
            //Act
            await testController.getFavourites(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 404);
        });
    });
});
