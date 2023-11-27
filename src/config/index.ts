"use strict"
import dotenv from 'dotenv';
import ms from 'ms';
dotenv.config();

const config = {
    app: {
        env: process.env.NODE_ENV,
        port: process.env.PORT || 8000,
        name: process.env.APPNAME || "Wastify"
    },
    mail: {
        email: process.env.EMAIL_ID,
        password: process.env.EMAIL_PASSWORD,
        name: process.env.EMAIL_NAME,
        sender: process.env.EMAIL_SENDER,
    },
    mongo: {
        dev: process.env.MONGO_URI_DEV,
        test: process.env.MONGO_URI_TEST,
        pro: process.env.MONGO_URI_PRO
    },
    auth: {
        access: {
            secret: process.env.JWT_ACCESS_SECRET || "wastifyserveraccesssecret",
            expiry:  ms(process.env.JWT_ACCESS_EXPIRATION ? process.env.JWT_ACCESS_EXPIRATION: "2d")
        },
        refresh: {
            secret: process.env.JWT_REFRESH_SECRET,
            expiry: process.env.JWT_REFRESH_EXPIRATION
        }
    }
}

export default config