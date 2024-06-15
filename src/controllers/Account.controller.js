export default class AccountController {
    #service;
    
    constructor(service) {
        this.#service = service;
    }
    
    async addAccount(req, res) {
        const invalidError = new Error("Invalid Account");
        
        try {
            if (!req.body) throw invalidError;
            
            const existing = await this.#service.findAccountByEmail(req.body.email);
            if (existing.length !== 0)
                return res.status(409).json({ message: "An account with this email already exists" });
            
            const newAccount = await this.#service.addAccount(req.body);
            
            if (!newAccount._id) throw invalidError;
            
            res.status(201).json(newAccount);
        } catch (e) {
            if (e === invalidError)
                return res.status(400).json({ message: e.message });
            
            res.status(500).json({ message: e.message });
        }
    }
    
    async login(req, res) {
        const invalidError = new Error("Invalid Account");
        
        try {
            if (!req.body) throw invalidError;
            
            const account = await this.#service.findAccountByEmailAndPass(req.body.email, req.body.password);
            
            res.status(200).json(account);
        } catch (e) {
            if (e === invalidError)
                return res.status(400).json({ message: e.message });
            
            res.status(500).json({ message: e.message });
        }
    }
}
