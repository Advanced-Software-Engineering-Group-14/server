import { Schema, model, SchemaTypes } from "mongoose";
import { __genCode } from "../helpers/string";
import dayjs from "dayjs";
import bcrypt from "bcrypt"
import { __generateAuthToken } from "../helpers/token";

const ManagerSchema = new Schema({
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
    role: {
        type: SchemaTypes.String,
        enum: ["SUDO", "ADMIN"],
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
    token: {
        type: SchemaTypes.String,
        default: null
    },
}, { timestamps: true })

ManagerSchema.pre("save", async function (next) {
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

ManagerSchema.methods.comparePasswords = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

ManagerSchema.methods.generateAuthToken = async function (): Promise<string> {
    let __token: string = await __generateAuthToken({
        id: this._id,
        email: this.email,
        type: this.role,
        isSuspended: this.meta.isSuspended
    })
    return __token
}

export const ManagerModel = model<any>("Manager", ManagerSchema);