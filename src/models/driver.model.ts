import { Schema, model, SchemaTypes } from "mongoose";
import { __genCode } from "../helpers/string";
import dayjs from "dayjs";
import bcrypt from "bcrypt"
import { __generateAuthToken } from "../helpers/token";

const DriverSchema = new Schema({
    surname: {
        type: SchemaTypes.String,
        required: true,
    },
    othernames: {
        type: SchemaTypes.String,
        required: true,
    },
    email: {
        type: SchemaTypes.String,
        required: true,
    },
    phone: {
        type: SchemaTypes.String,
        required: true,
    },
    password: {
        type: SchemaTypes.String,
        required: true,
    },
    rating: {
        type: SchemaTypes.String,
        required: true,
    },
    gender: {
        type: SchemaTypes.String,
        enum: ["MALE", "FEMALE"],
        required: true,
    },
    verification: {
        type: new Schema({
            code: {
                type: SchemaTypes.String,
                required: true,
                default: function () {
                    return __genCode(6);
                },
            },
            expiresAt: {
                type: SchemaTypes.Date,
                required: true,
                default: function () {
                    return dayjs().add(10, "minutes");
                }
            }
        }),
        required: false,
    },
    token: {
        type: SchemaTypes.String,
        default: null
    },
    profileImageUrl: {
        type: SchemaTypes.String,
        default: ""
    },
    meta: {
        isFirstLogin: {
            type: SchemaTypes.Boolean,
            default: true,
            required: true
        },
        isSuspended: {
            type: SchemaTypes.Boolean,
            default: false,
            required: true
        }
    },
}, { timestamps: true })

DriverSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(this.password, salt)
        this.password = hash;
        next();
    } catch (err: any) {
        next(err);
    }
})

DriverSchema.methods.comparePasswords = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

DriverSchema.methods.generateAuthToken = async function (): Promise<string> {
    let __token: string = await __generateAuthToken({
        id: this._id,
        email: this.email,
        type: "DRIVER",
        isSuspended: this.meta.isSuspended
    })
    return __token
}

export const DriverModel = model<any>("Driver", DriverSchema);