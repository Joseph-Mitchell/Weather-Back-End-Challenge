import { describe, it } from "mocha";
import { assert } from "chai";
import sinon from "sinon";

import AccountController from "../../src/controllers/Account.controller.js";

describe("addAccount", () => {  
    it("should call res.status with 201 and res.json with account Object", async () => {
        //Arrange
        const stubbedService = { findAccountByEmail: sinon.stub(), addAccount: sinon.stub() };
        const stubbedResponse = { status: sinon.stub().returnsThis(), json: sinon.stub() };
        
        const testController = new AccountController(stubbedService);
        const testAccount = { _id: "1", email: "test@email.com", password: "testPass" };
        const testRequest = { body: testAccount };
        
        stubbedService.findAccountByEmail.resolves(0);
        stubbedService.addAccount.resolves(testAccount);
        
        //Act
        const actual = await testController.addAccount(testRequest, stubbedResponse);
        
        //Assert
        sinon.assert.calledWith(stubbedResponse.status, 201);
        sinon.assert.calledWith(stubbedResponse.json, testAccount);
    });
});