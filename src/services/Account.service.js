import Account from "../models/Account.model.js";

export default class AccountService {
    async addAccount(newAccount) {
        let account
        try {
            account = new Account(newAccount);
        } catch (e) {
            throw new Error("Invalid Account")
        }
        return await account.save(account);
    }
    
    async findAccountByEmail(email) {
        return await Account.find({ email: email });
    }
}
