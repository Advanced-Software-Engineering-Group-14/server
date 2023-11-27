import _ from "lodash"
import { __genPassword } from "../helpers/string";
import { ManagerModel } from "../models"
import { NextFunction, Request, Response } from 'express';
import { createError } from "../utils";
import { sendMail } from "./mailer";
import { ChangePasswordInput } from "./auth.controller";

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

export async function updateManagerPassword(req: Request<{}, {}, ChangePasswordInput>, res: Response, next: NextFunction) {
    const { oldPassword, newPassword } = req.body
    const { user: _user } = req

    try {
        const existingUser = await ManagerModel.findById(_user?.id)
        if (!existingUser) {
            return next(createError(404, "Account not found"))
        }

        const __isValid = await existingUser.comparePasswords(_.trim(oldPassword));

        if (!__isValid) {
            return next(createError(401, 'Invalid password!'));
        }

        if (existingUser?.meta?.isSuspended) {
            return next(createError(401, "Account has been suspended"))
        }

        existingUser.password = _.trim(newPassword);
        await existingUser.save();


        const __token = await existingUser.generateAuthToken()

        const updatedUser = await ManagerModel.findByIdAndUpdate(existingUser?._id, { token: __token }, { new: true })

        req.user = {
            isSuspended: updatedUser?.isSuspended,
            email: updatedUser?.email,
            id: updatedUser?._id,
            type: updatedUser?.role
        }

        res.status(200).json({
            success: true,
            message: 'Password change successful!',
            data: updatedUser,
        });

    } catch (error) {
        next(error)
    }
}

export async function suspendManager(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    const { id } = req.params
    const { user: _user } = req

    try {
        const existingUser = await ManagerModel.findById(id)

        if (!existingUser) {
            return next(createError(404, "Account not found"))
        }

        if (existingUser?.role === "SUDO") {
            return next(createError(401, "SUDO account can not be suspended"))
        }

        if (existingUser?.meta?.isSuspended) {
            return next(createError(401, "Account has already been suspended"))
        }
        
        const updatedUser = await ManagerModel.findByIdAndUpdate(existingUser?._id, {
            meta: {
            isSuspended: true
            }
        }, { new: true })

        await sendMail({
            args: {
                email: existingUser?.email,
                template: "ManagerAccountSuspended",
                data: {
                    user: updatedUser,
                }
            }
        })
        
        res.status(200).json({
            success: true,
            message: 'Account blocked!',
            data: updatedUser,
        });

    } catch (error) {
        next(error)
    }

}
