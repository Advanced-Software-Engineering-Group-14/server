import { Schema, model, SchemaTypes } from "mongoose";
import { BinPackagePayment } from "../types";

const BinPackagePaymentSchema = new Schema({
    status: {
        type: SchemaTypes.String,
        enum: ["pending", "processing", "accepted", "delivered", "cancelled"],
        required: true
    },
    binNum: {
        type: SchemaTypes.Number,
        required: true
    },
    homeowner: {
        type: SchemaTypes.ObjectId,
        ref: "Homeowner",
        required: true
    },
    driver: {
        type: SchemaTypes.ObjectId,
        ref: "Driver",
        required: true
    },
    payment: {
        type: SchemaTypes.ObjectId,
        ref: "Payment",
        required: true
    },
    date: {
        type: SchemaTypes.Date,
        required: true,
    },
}, { timestamps: true })


export const BinPackagePaymentModel = model<BinPackagePayment>("BinPackagePayment", BinPackagePaymentSchema);