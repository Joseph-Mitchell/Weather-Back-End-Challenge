import { Router } from "express";
import AccountMiddleware from "../middleware/Account.middleware.js";

export default class AccountRouter {
    #router;
    #pathRoot = "/";
    #controller;
    
    getRouter() {
        return this.#router;
    }
    
    getPathRoot() {
        return this.#pathRoot;
    }
    
    constructor(controller) {
        this.#router = Router();             
        this.#controller = controller;
        
        this.#initialiseRouter();
    }
    
    #initialiseRouter() {
        this.#router.post("/register", AccountMiddleware.validateRegDetails(), (req, res) => {
            this.#controller.addAccount(req, res);
        });
    }
}
