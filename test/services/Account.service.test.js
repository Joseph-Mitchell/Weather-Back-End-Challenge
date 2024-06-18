import { describe, it } from "mocha";
import { assert } from "chai";
import sinon from "sinon";

import Account from "../../src/models/Account.model.js";
import AccountService from "../../src/services/Account.service.js";

describe("Service: ", () => {
    describe("addAccount", () => {
        it("should return the resolution of Account.save", async () => {
            //Arrange
            const saveStub = sinon.stub(Account.prototype, "save");
            const testService = new AccountService();
            const testAccount = { email: "test@email.com", password: "testPass" };
            saveStub.resolves(testAccount);
            
            //Act
            const actual = await testService.addAccount(testAccount);
            
            //Assert
            assert.deepEqual(actual, testAccount);
            
            saveStub.restore();
        });
    });
});
