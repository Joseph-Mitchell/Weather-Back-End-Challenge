import { describe, it } from "mocha";

import Config from '../../src/config/Config.js';
import Server from "../../src/server/Server.js";
import Database from "../../src/database/Database.js";
import AccountRouter from '../../src/routers/Account.router.js';
import AccountController from '../../src/controllers/Account.controller.js';
import AccountService from '../../src/services/Account.service.js';
import Account from '../../src/models/Account.model.js';

import * as testData from "../data/testAccounts.js";
import { assert } from "chai";
import supertest from "supertest";

describe("Integration Tests", () => {
    let server;
    let database;
    let requester;
    
    before(async () => {
        Config.load();
        const { PORT, HOST, DB_URI } = process.env;

        const router = new AccountRouter(new AccountController(new AccountService()));

        server = new Server(PORT, HOST, router);
        database = new Database(DB_URI);

        server.start();
        await database.connect();
        
        requester = supertest(server.getApp());
    });
    
    after(async () => {
        server.close();
        await database.close();
    });
    
    beforeEach(async () => {
        try {
            await Account.deleteMany();
        } catch (e) {
            console.log(e.message);
            throw new Error();
        }
        try {
            await Account.insertMany(testData.existingAccounts);
            console.log("Database populated with test todos");
        } catch (e) {
            console.log(e.message);
            console.log("Error inserting");
            throw new Error();
        }
    });
    
    describe("register account", () => {
        it("should respond 201 to valid request", async () => {
            //Act
            const actual = await requester.post("/register").send(testData.newAccounts.valid);
            
            //Assert
            assert.equal(actual.status, 201);
        });
        
        it("should respond 400 with invalid email", async () => {
            //Act
            const actual = await requester.post("/register").send(testData.newAccounts.invalidEmail);
            
            //Assert
            assert.equal(actual.status, 400);
        });
    });
})