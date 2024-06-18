import { describe, it } from "mocha";
import AccountValidator from "../../src/middleware/Account.middleware.js";
import { assert } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";

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

describe("authenticateToken", () => {   
    it("should call next in normal conditions", () => {
        //Arrange
        sinon.stub(jwt, "verify").callsArgWith(2, 0, { token: 1 });
        const nextStub = sinon.stub();
        const testReq = {
            headers: {
                "x-access-token": 1
            }
        };
        const stubbedRes = {
            status: sinon.stub().returnsThis,
            send: sinon.stub()
        }
        
        //Act
        AccountValidator.authenticateToken(testReq, stubbedRes, nextStub);
        
        //Assert
        sinon.assert.called(nextStub);
        
        //Cleanup
        jwt.verify.restore();
    })
});