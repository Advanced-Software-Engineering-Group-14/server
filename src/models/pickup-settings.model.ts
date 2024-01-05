import { Schema, model, SchemaTypes } from "mongoose";
import { PickupSettingsRes } from "../types";

const PickupSettingsSchema = new Schema({
    dailyPickupLimitPerDriver: {
        type: SchemaTypes.Number,
        required: true,
        default: 10
    },
    pickupPrice: {
        type: SchemaTypes.Number,
        required:true
    }
}, { timestamps: true })


export const PickupSettingsModel = model<PickupSettingsRes>("PickupSettings", PickupSettingsSchema);