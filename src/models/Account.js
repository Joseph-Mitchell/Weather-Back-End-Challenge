import { Schema, model } from "mongoose";

const todoSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const Todo = model("Todo", todoSchema);

export default Todo;