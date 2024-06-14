import { Schema, model } from "mongoose";

const accountSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const Account = model("Account", accountSchema);

export default Account;