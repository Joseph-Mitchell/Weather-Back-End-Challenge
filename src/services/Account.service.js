import Account from "../models/Account.model.js";

export default class AccountService {
    async addNew(newAccount) {
        let account = new Account(newAccount);
        return await account.save(account);
    }
    
    async findByEmail(email) {
        return await Account.find({ email: email });
    }
}
