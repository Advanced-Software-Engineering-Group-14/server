import { Schema, model, SchemaTypes } from "mongoose";
import { BinPackagePayment } from "../types";

const BinPackagePaymentSchema = new Schema({
    homeowner: {
        type: SchemaTypes.ObjectId,
        ref: "Homeowner",
        required: true
    },
    package: {
        type: SchemaTypes.ObjectId,
        ref: "BinPackage",
        required: true
    },
    payment: {
        type: SchemaTypes.ObjectId,
        ref: "Payment",
        required: true
    },
}, { timestamps: true })


export const BinPackagePaymentModel = model<BinPackagePayment>("BinPackagePayment", BinPackagePaymentSchema);