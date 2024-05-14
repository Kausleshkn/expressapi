import mongoose, { Schema } from "mongoose";

const userScima = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true },
    pwd: { type: String, required: true },
    phone: { type: Number, validate: (value) => value.toString().match(/^\d{10}$/) !== null },
    msg: { type: String, validate: (value) => value.length >= 20 }
});

const userModel = mongoose.model("complain", userScima);

export default userModel;