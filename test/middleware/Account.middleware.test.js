import { describe, it } from "mocha";
import AccountValidator from "../../src/middleware/Account.middleware.js";
import { Assertion, assert } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";


describe("Middleware: ", () => {
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
        let testToken;
        let nextStub;
        let testReq;
        let stubbedRes;
        
        beforeEach(() => {
            testToken = jwt.sign("75643", process.env.SECRET);
            nextStub = sinon.stub();
            testReq = {
                headers: {
                    "x-access-token": testToken
                },
                body: {}
            };
            stubbedRes = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
        });
        
        afterEach(() => {
            testToken = undefined;
            nextStub = undefined;
            testReq = undefined;
            stubbedRes = undefined;
        });
        
        it("should call next in normal conditions", () => {            
            //Act
            AccountValidator.authenticateToken(testReq, stubbedRes, nextStub);
            
            //Assert
            sinon.assert.called(nextStub);
            assert.equal(testReq.body.userId, "75643");
        });
        
        it("should respond with 401 if no token provided in header", () => {           
            //Arrange
            testReq = {
                headers: {}
            };
            
            //Act
            AccountValidator.authenticateToken(testReq, stubbedRes, nextStub);
            
            //Assert
            sinon.assert.calledWith(stubbedRes.status, 401);
        });
        
        it("should respond with 401 if jwt.verify had errors", () => {
            //Arrange
            sinon.stub(jwt, "verify").callsArgWith(2, 1, { token: 1 });
            
            //Act
            AccountValidator.authenticateToken(testReq, stubbedRes, nextStub);
            
            //Assert
            sinon.assert.calledWith(stubbedRes.status, 401);
            
            //Cleanup
            jwt.verify.restore();
        });
    });
});
