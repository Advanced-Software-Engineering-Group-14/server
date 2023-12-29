import { Schema, model, SchemaTypes } from "mongoose";

const PickupSchema = new Schema({
    status: {
        type: SchemaTypes.String,
        enum: ["pending", "assigned" , "ongoing" , "cancelled", "completed"],
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
    date: {
        type: SchemaTypes.Date,
        required: true,
    },
}, { timestamps: true })


export const PickupModel = model<any>("Pickup", PickupSchema);