import { Schema, model, SchemaTypes } from "mongoose";

const PaymentSchema = new Schema({
    paymentType: {
        type: SchemaTypes.String,
        enum: ["subscription", "bin"],
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
        required: true
    },
    totalNumber: {
        type: SchemaTypes.Number,
        required: true
    },
}, { timestamps: true })


export const PaymentModel = model<any>("Payment", PaymentSchema);