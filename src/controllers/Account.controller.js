import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default class AccountController {
    #service;
    
    constructor(service) {
        this.#service = service;
    }
    
    async addAccount(req, res) {
        const invalidError = new Error("Invalid Account");
        
        try {
            if (!req.body || Object.keys(req.body).length === 0) throw invalidError;
            
            const existing = await this.#service.findAccountByEmail(req.body.email);
            
            if (existing !== null)
                return res.status(409).json({ message: "An account with this email already exists" });

            const newAccount = await this.#service.addAccount(req.body);
            
            if (newAccount._id === undefined) throw invalidError;
            
            res.status(201).json({ id: newAccount._id, email: newAccount.email });
        } catch (e) {
            if (e === invalidError)
                return res.status(400).json({ message: e.message });;
            
            res.status(500).json({ message: e.message });
        }
    }
    
    async login(req, res) {
        const invalidError = new Error("Invalid Account");
        
        try {
            if (!req.body || Object.keys(req.body).length === 0) throw invalidError;
            
            const account = await this.#service.findAccountByEmail(req.body.email);

            if (account === null)
                return res.status(404).json({ message: "email or password incorrect" });           

            if (!bcrypt.compareSync(req.body.password, account.password)) {
                return res.status(404).json({ message: "email or password incorrect" });
            }
                
            res.status(200).json({ token: jwt.sign({ id: account._id.toString() }, process.env.SECRET) });
        } catch (e) {
            if (e === invalidError)
                return res.status(400).json({ message: e.message });
            
            res.status(500).json({ message: e.message });
        }
    }
    
    async changePassword(req, res) {
        const invalidError = new Error("Invalid Account");
        
        try {
            if (!req.body || Object.keys(req.body).length === 0) throw invalidError;
            
            const encryptedPass = bcrypt.hashSync(req.body.password, 8);
            const account = await this.#service.updateAccountPassword(req.body.userId, encryptedPass);

            if (account === null)
                return res.status(404).json({ message: "could not find account" });    
            
            res.status(204).json({ message: "password changed successfully" });
        } catch (e) {
            if (e === invalidError)
                return res.status(400).json({ message: e.message });
            
            res.status(500).json({ message: e.message });
        }
    }
    
    async getFavourites(req, res) {
        const invalidError = new Error("Invalid Account");
        
        try {           
            const account = await this.#service.findAccountById(req.body.userId);

            if (account === null)
                return res.status(404).json({ message: "could not find account" });    
            
            res.status(200).json(account.favourites);
        } catch (e) {
            if (e === invalidError)
                return res.status(400).json({ message: e.message });
            
            res.status(500).json({ message: e.message });
        }
    }
    
    async pushFavourite(req, res) {
        const invalidError = new Error("Invalid Account");
        
        try {          
            if (!req.body.favourites || Object.keys(req.body.favourites).length === 0) throw invalidError;
            
            const account = await this.#service.pushNewFavourite(req.body.userId);

            if (account === null)
                return res.status(404).json({ message: "could not find account" });    
            
            res.status(204).json({ message: "favourite was added" });
        } catch (e) {
            if (e === invalidError)
                return res.status(400).json({ message: e.message });
            
            res.status(500).json({ message: e.message });
        }
    }
}
