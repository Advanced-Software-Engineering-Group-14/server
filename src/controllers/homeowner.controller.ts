import _ from "lodash"
import { __genPassword } from "../helpers/string";
import { __generateQuery } from "../helpers/query"
import { HomeownerModel } from "../models"
import { NextFunction, Request, Response } from 'express';
import { createError } from "../utils";
import { sendMail } from "./mailer";
import { ChangePasswordInput } from "./auth.controller";

type CreateHomeownerInput = {
    surname: string
    othernames: string
    email: string
    phone: string
    gender: "MALE" | "FEMALE"
}

export async function createHomeowner(req: Request<{}, {}, CreateHomeownerInput>, res: Response, next: NextFunction) {
    const { email, othernames, phone, surname, gender } = req.body

    try {
        if (!email || !othernames || !surname || !phone || !gender) {
            return next(createError(400, 'Provide all required fields'));
        }

        const userExists = await HomeownerModel.findOne({ email })

        if (userExists) {
            return next(createError(409, 'User already exists with this email'));
        }

        const password = __genPassword(12);

        const newUser = new HomeownerModel({
            othernames,
            surname,
            email,
            phone,
            password,
            gender,
        })

        await newUser.save()

        res.status(201).json({
            success: true,
            data: newUser,
        });


    } catch (error) {
        next(error)
    }
}
