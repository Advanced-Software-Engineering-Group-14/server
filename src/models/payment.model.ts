import { Schema, model, SchemaTypes } from "mongoose";
import { PaymentRes } from "../types";

const PaymentSchema = new Schema({
    paymentType: {
        type: SchemaTypes.String,
        enum: ["pickup", "bin"],
        required: true
    },
    paymentMethod: {
        type: SchemaTypes.String,
        enum: ["bank", "card", "mobile_money"],
        required: true
    },
    response: {
        type: SchemaTypes.String,
        enum: ["success", "failure"],
        required: true
    },
    homeowner: {
        type: SchemaTypes.ObjectId,
        ref: "Homeowner",
    },
    refNumber: {
        type: SchemaTypes.String,
        required: true,
        unique: true
    },
    totalNumber: {
        type: SchemaTypes.Number,
        required: true
    },
}, { timestamps: true })


export const PaymentModel = model<PaymentRes>("Payment", PaymentSchema);