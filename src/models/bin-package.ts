import { Schema, model, SchemaTypes } from "mongoose";

const BinPackageSchema = new Schema({
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


export const BinPackageModel = model<any>("BinPackage", BinPackageSchema);