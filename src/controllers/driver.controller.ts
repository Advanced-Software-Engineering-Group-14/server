import _ from "lodash"
import { __genPassword } from "../helpers/string";
import { __generateQuery } from "../helpers/query"
import { DriverModel } from "../models"
import { NextFunction, Request, Response } from 'express';
import { createError } from "../utils";
import { sendMail } from "./mailer";
import { ChangePasswordInput } from "./auth.controller";

type CreateDriverInput = {
    surname: string
    othernames: string
    email: string
    phone: string
    gender: "MALE" | "FEMALE"
}

export async function createDriver(req: Request<{}, {}, CreateDriverInput>, res: Response, next: NextFunction) {
    const { email, othernames, phone, surname, gender } = req.body

    try {
        if (!email || !othernames || !surname || !phone || !gender) {
            return next(createError(400, 'Provide all required fields'));
        }

        const userExists = await DriverModel.findOne({ email })

        if (userExists) {
            return next(createError(409, 'User already exists with this email'));
        }

        const password = __genPassword(12);

        const newUser = new DriverModel({
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

export async function getAllDrivers(req: Request, res: Response, next: NextFunction) {
    try {
        const drivers = await DriverModel.find()

        res.status(200).json({
            success: true,
            message: 'Drivers fetched successfully',
            data: drivers,
        });
    } catch (error) {
        next(error)
    }
}

export async function getDriverById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
        if (!id) {
            return next(createError(400, 'Provide user id'));
        }

        const driver = await DriverModel.findById(id)

        if (!driver) {
            return next(createError(404, "Account not found"))
        }

        res.status(200).json({
            success: true,
            message: 'Driver fetched successfully',
            data: driver,
        });
    } catch (error) {
        next(error)
    }
}

export async function suspendDriver(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    const { id } = req.params
    const { user: _user } = req

    try {
        const existingUser = await DriverModel.findById(id)

        if (!existingUser) {
            return next(createError(404, "Account not found"))
        }

        if (_user.id === id) {
            return next(createError(401, "You can not suspend yourself"))
        }


        if (existingUser?.meta?.isSuspended) {
            return next(createError(401, "Account has already been suspended"))
        }
        
        const updatedUser = await DriverModel.findByIdAndUpdate(existingUser?._id, {
            meta: {
            isSuspended: true
            }
        }, { new: true })

        await sendMail({
            args: {
                email: existingUser?.email,
                template: "DriverAccountSuspended",
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

export async function unsuspendDriver(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    const { id } = req.params
    const { user: _user } = req

    try {
        const existingUser = await DriverModel.findById(id)

        if (!existingUser) {
            return next(createError(404, "Account not found"))
        }

        if (_user.id === id) {
            return next(createError(401, "You can not suspend yourself"))
        }

        if (!existingUser?.meta?.isSuspended) {
            return next(createError(401, "Account has already been unsuspended"))
        }
        
        const updatedUser = await DriverModel.findByIdAndUpdate(existingUser?._id, {
            meta: {
            isSuspended: false
            }
        }, { new: true })

        await sendMail({
            args: {
                email: existingUser?.email,
                template: "DriverAccountUnSuspended",
                data: {
                    user: updatedUser,
                }
            }
        })
        
        res.status(200).json({
            success: true,
            message: 'Account unblocked!',
            data: updatedUser,
        });

    } catch (error) {
        next(error)
    }

}



export async function deleteDriver(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
        if (!id) {
            return next(createError(400, 'Provide user id'));
        }

        const driver = await DriverModel.findById(id)

        if (!driver) {
            return next(createError(404, "Account not found"))
        }

        const deletedDriver = await DriverModel.findByIdAndDelete(id)

        res.status(200).json({
            success: true,
            message: 'Driver deleted successfully',
            data: deletedDriver,
        });
    } catch (error) {
        next(error)
    }
}