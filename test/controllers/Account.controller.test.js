import { beforeEach, describe, it } from "mocha";
import sinon from "sinon";
import jwt from "jsonwebtoken";

import AccountController from "../../src/controllers/Account.controller.js";
import { assert } from "chai";
import Config from "../../src/config/Config.js";

describe("Controller", () => {
    let stubbedService;
    let stubbedResponse;
    let testController;
    let testAccount;
    let testRequest;

    describe("addAccount", () => {
        beforeEach(() => {
            stubbedService = { findAccountByEmail: sinon.stub(), addAccount: sinon.stub() };
            stubbedResponse = { status: sinon.stub().returnsThis(), json: sinon.stub() };
            
            testController = new AccountController(stubbedService);
            testAccount = { _id: "1", email: "test@email.com", password: "testPass" };
            testRequest = { body: testAccount };
            
            stubbedService.findAccountByEmail.resolves([]);
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
            sinon.assert.calledWith(stubbedResponse.json, testAccount);
        });
        
        it("should call res.status with 500 if findAccountByEmail rejects", async () => {
            //Arrange       
            stubbedService.findAccountByEmail.rejects(new Error());
            
            //Act
            await testController.addAccount(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 500);
        });
        
        it("should call res.status with 409 if findAccountByEmail.length is not 0", async () => {
            //Arrange       
            stubbedService.findAccountByEmail.resolves([{}]);
            
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
            stubbedService = { findAccountByEmailAndPass: sinon.stub() };
            stubbedResponse = { status: sinon.stub().returnsThis(), json: sinon.stub() };
            
            testController = new AccountController(stubbedService);
            testAccount = { _id: "1", email: "test@email.com", password: "testPass" };
            testRequest = { body: testAccount };
            
            stubbedService.findAccountByEmailAndPass.resolves(testAccount);
        });
        
        afterEach(() => {
            stubbedService = undefined;
            stubbedService = undefined;
            stubbedResponse = undefined;
            stubbedResponse = undefined;
            testController = undefined;
            testAccount = undefined;
        });
        
        it("should call res.status with 200 and res.json encoded _id", async () => {
            Config.load();
            
            //Act
            await testController.login(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 200);
            assert.equal(jwt.verify(stubbedResponse.json.getCall(0).args[0], process.env.SECRET), testAccount._id);
        });
        
        it("should call res.status with 500 if findAccountByEmail rejects", async () => {
            //Arrange       
            stubbedService.findAccountByEmailAndPass.rejects(new Error());
            
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
        
        it("should call res.status with 400 if findAccountByEmailAndPass resolved value does not have _id key", async () => {
            //Arrange       
            testAccount._id = undefined;
            
            //Act
            await testController.login(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledOnceWithExactly(stubbedResponse.status, 400);
        });
    });
});