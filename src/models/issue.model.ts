import { Schema, model, SchemaTypes } from "mongoose";
import { IssueRes } from "../types";

const IssueSchema = new Schema({
    title: {
        type: SchemaTypes.String,
        required: true
    },
    description: {
        type: SchemaTypes.String,
        required: true
    },
    driver: {
        type: SchemaTypes.ObjectId,
        ref: "Driver",
        required: true
    },
}, { timestamps: true })


export const IssueModel = model<IssueRes>("Issue", IssueSchema);