import { Schema, model, SchemaTypes } from "mongoose";
import { BinPackageRes } from "../types";

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
    size: {
        type: SchemaTypes.String,
        enum: ["sm", "md", "lg"],
        required: true
    },
    binNum: {
        type: SchemaTypes.Number,
        required: true
    },
}, { timestamps: true })


export const BinPackageModel = model<BinPackageRes>("BinPackage", BinPackageSchema);