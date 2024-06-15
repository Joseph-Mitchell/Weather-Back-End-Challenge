import { describe, it } from "mocha";
import { assert } from "chai";
import sinon from "sinon";

import AccountController from "../../src/controllers/Account.controller.js";

describe("addAccount", () => {  
    let stubbedService;
    let stubbedResponse;
    let testController;
    let testAccount;
    let testRequest;
    
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
    
    it("should call res.status with 400 if addAccount resolved value does not have _id key", async () => {
        //Arrange       
        testAccount._id = undefined;
        
        //Act
        await testController.addAccount(testRequest, stubbedResponse);
        
        //Assert
        sinon.assert.calledOnceWithExactly(stubbedResponse.status, 400);
    });
});