import { Schema, model, SchemaTypes } from "mongoose";
import { BinRes } from "../types";

const BinSchema = new Schema({
    category: {
        type: SchemaTypes.String,
        enum: ["recycling", "trash"],
        required: true
    },
    status: {
        type: SchemaTypes.String,
        enum: ["full", "empty"],
        required: true,
        default: "empty"
    },
    price: {
        type: SchemaTypes.Number,
        default: 50
    },
    isCustom: {
        type: SchemaTypes.Boolean,
        default: false
    },
    size: {
        type: SchemaTypes.String,
        enum: ["sm", "md", "lg"],
        required: true
    },
    homeowner: {
        type: SchemaTypes.ObjectId,
        ref: "Homeowner",
        default: null,
    }
}, { timestamps: true })


export const BinModel = model<BinRes>("Bin", BinSchema);