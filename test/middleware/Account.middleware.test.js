import { describe, it } from "mocha";
import AccountValidator from "../../src/middleware/Account.middleware.js";
import { assert } from "chai";
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
        it("should call next in normal conditions", () => {
            //Arrange
            const nextStub = sinon.stub();
            const testReq = {
                headers: {
                    "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzE4NzQzMzE1fQ.YAk7bBQyFOvVtD0tsDV8zU7MVRxyJMCvmFvbqPkXZhQ"
                }
            };
            const stubbedRes = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
            
            //Act
            AccountValidator.authenticateToken(testReq, stubbedRes, nextStub);
            
            //Assert
            sinon.assert.called(nextStub);
        });
        
        it("should respond with 401 if no token provided in header", () => {
            console.log(jwt.sign({ id: 1 }, process.env.SECRET));
            
            //Arrange
            const nextStub = sinon.stub();
            const testReq = {
                headers: {}
            };
            const stubbedRes = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
            
            //Act
            AccountValidator.authenticateToken(testReq, stubbedRes, nextStub);
            
            //Assert
            sinon.assert.calledWith(stubbedRes.status, 401);
        });
    });
});