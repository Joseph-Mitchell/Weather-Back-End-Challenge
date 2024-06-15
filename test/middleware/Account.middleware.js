import { describe, it } from "mocha";
import AccountValidator from "../../src/middleware/Account.middleware.js";
import { assert } from "chai";

describe("validateRegDetails", () => {
    it("should return an array in normal circumstances", () => {
        //Act
        const actual = AccountValidator.validateRegDetails();
        
        //Assert
        assert.isArray(actual);
    })
})