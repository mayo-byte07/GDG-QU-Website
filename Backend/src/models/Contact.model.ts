import { Model, Schema, model } from "mongoose";
import type { IContact } from "../types/Contact.interface.js";

const ContactSchema: Schema<IContact> = new Schema(
    {
        name: { type: String, required: true, minlength: 2, maxlength: 100 },
        email: { type: String, required: true },
        message: { type: String, required: true , minlength: 10, maxlength: 1000 },
    },
    { timestamps: true }
);

const Contact: Model<IContact> = model<IContact>("Contact", ContactSchema);

export default Contact;
