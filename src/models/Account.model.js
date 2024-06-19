import { Schema, model } from "mongoose";

const accountSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    favourites: [{
        name: String,
        lat: Number,
        lon: Number,
        country: String,
        state: String
    }]
});

const Account = model("Account", accountSchema);

export default Account;