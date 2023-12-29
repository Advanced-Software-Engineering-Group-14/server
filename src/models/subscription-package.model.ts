import { Schema, model, SchemaTypes } from "mongoose";

const SubscriptionPackageSchema = new Schema({
    name: {
        type: SchemaTypes.String,
        required: true
    },
    price: {
        type: SchemaTypes.Number,
        required: true
    },
    isCustom: {
        type: SchemaTypes.Boolean,
        required: true,
        default: false
    },
    binNum: {
        type: SchemaTypes.Number,
        required: true
    },
}, { timestamps: true })


export const SubscriptionPackageModel = model<any>("SubscriptionPackage", SubscriptionPackageSchema);