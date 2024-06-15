import { describe, it } from "mocha";
import AccountValidator from "../../src/middleware/Account.middleware.js";
import { assert } from "chai";
import sinon from "sinon";

describe("validateRegDetails", () => {
    it("should return an array in normal conditions", () => {
        //Act
        const actual = AccountValidator.validateRegDetails();
        
        //Assert
        assert.isArray(actual);
    });
});

describe("handleValidationErrors", () => {
    it("should call next in normal conditions", () => {
        //Arrange
        const nextStub = sinon.stub();
        
        //Act
        AccountValidator.handleValidationErrors({}, {}, nextStub);
        
        //Assert
        sinon.assert.called(nextStub);
    });
});