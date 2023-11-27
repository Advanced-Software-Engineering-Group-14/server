import _ from "lodash"
import { __genPassword } from "../helpers/string";
import { ManagerModel } from "../models"
import { NextFunction, Request, Response } from 'express';
import { createError } from "../utils";
import { sendMail } from "./mailer";

type CreateManagerInput = {
    surname: string
    othernames: string
    email: string
    phone: string
    role: "ADMIN" | "SUDO"
}

export async function createManager(req: Request<{}, {}, CreateManagerInput>, res: Response, next: NextFunction) {
    const { email, othernames, phone, role, surname } = req.body

    try {
        if (!email || !othernames || !surname || !phone || !role) {
            return next(createError(400, 'Provide all required fields'));
        }

        const userExists = await ManagerModel.findOne({ email })

        if (userExists) {
            return next(createError(409, 'User already exists with this email'));
        }

        const password = __genPassword(12);

        const newUser = new ManagerModel({
            othernames,
            surname,
            email,
            phone,
            role,
            password
        })

        await newUser.save()

        await sendMail({
            args: {
                email,
                template: "ManagerCreated",
                data: {
                    password,
                    user: newUser,
                }
            }
        })

        // req.user = newUser

        res.status(201).json({
            success: true,
            data: newUser,
        });
        
        next();

    } catch (error) {
        next(error)
    }
}
