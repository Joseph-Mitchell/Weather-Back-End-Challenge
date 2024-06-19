import Account from "../models/Account.model.js";
import * as bcrypt from "bcrypt"

export default class AccountService {
    async addAccount(newAccount) {
        let account
        try {
            account = new Account({ email: newAccount.email, password: bcrypt.hashSync(newAccount.password, 8) });
        } catch (e) {
            console.log(e);
            throw new Error("Invalid Account")
        }
        return await account.save();
    }
    
    async findAccountByEmail(email) {
        return await Account.findOne({ email: email });
    }
    
    async findAccountByEmailAndPass(email, password) {
        return await Account.findOne({ email: email, password: password });
    }
    
    async updateAccountPassword(id, password) {
        return await Account.findByIdAndUpdate(id, { password: password });
    }
    
    async findAccountById(id) {
        return await Account.findById(id);
    }
    
    async pushNewFavourite(id, favourite) {
        return await Account.findByIdAndUpdate(id, { $push: { favourites: favourite } });
    }
    
    async pullFavourite(id, lat, lon) {
        return await Account.findByIdAndUpdate(id, { $pull: { favourites: { lat: lat, lon: lon } } });
    }
}
