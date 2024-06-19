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
        this.#router.post("/login", (req, res) => {
            this.#controller.login(req, res);
        });
        this.#router.put("/changepass", AccountMiddleware.authenticateToken, (req, res) => {
            this.#controller.changePassword(req, res);
        });
        this.#router.get("/favourites", AccountMiddleware.authenticateToken, (req, res) => {
            this.#controller.getFavourites(req, res);
        });
        this.#router.put("/favourites/add", AccountMiddleware.authenticateToken, (req, res) => {
            this.#controller.pushFavourite(req, res);
        });
    }
}
