import { Schema, model, SchemaTypes } from "mongoose";

const BinSchema = new Schema({
    category: {
        type: SchemaTypes.String,
        enum: ["recycling", "trash"],
        required: true
    },
    status: {
        type: SchemaTypes.String,
        enum: ["full", "empty"],
        required: true
    },
    price: {
        type: SchemaTypes.Number,
        default: 50
    },
}, { timestamps: true })


export const BinModel = model<any>("Bin", BinSchema);