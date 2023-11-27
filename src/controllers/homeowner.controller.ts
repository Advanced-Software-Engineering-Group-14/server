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

export async function getAllHomeowners(req: Request, res: Response, next: NextFunction) {
    try {
        const homeowners = await HomeownerModel.find()

        res.status(200).json({
            success: true,
            message: 'Homeowners fetched successfully',
            data: homeowners,
        });
    } catch (error) {
        next(error)
    }
}

export async function getHomeownerById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
        if (!id) {
            return next(createError(400, 'Provide user id'));
        }

        const driver = await HomeownerModel.findById(id)

        if (!driver) {
            return next(createError(404, "Account not found"))
        }

        res.status(200).json({
            success: true,
            message: 'Homeowner fetched successfully',
            data: driver,
        });
    } catch (error) {
        next(error)
    }
}

export async function suspendHomeowner(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    const { id } = req.params
    const { user: _user } = req

    try {
        const existingUser = await HomeownerModel.findById(id)

        if (!existingUser) {
            return next(createError(404, "Account not found"))
        }

        if (_user.id === id) {
            return next(createError(401, "You can not suspend yourself"))
        }


        if (existingUser?.meta?.isSuspended) {
            return next(createError(401, "Account has already been suspended"))
        }
        
        const updatedUser = await HomeownerModel.findByIdAndUpdate(existingUser?._id, {
            meta: {
            isSuspended: true
            }
        }, { new: true })

        await sendMail({
            args: {
                email: existingUser?.email,
                template: "HomeownerAccountSuspended",
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

export async function unsuspendHomeowner(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    const { id } = req.params
    const { user: _user } = req

    try {
        const existingUser = await HomeownerModel.findById(id)

        if (!existingUser) {
            return next(createError(404, "Account not found"))
        }

        if (_user.id === id) {
            return next(createError(401, "You can not suspend yourself"))
        }

        if (!existingUser?.meta?.isSuspended) {
            return next(createError(401, "Account has already been unsuspended"))
        }
        
        const updatedUser = await HomeownerModel.findByIdAndUpdate(existingUser?._id, {
            meta: {
            isSuspended: false
            }
        }, { new: true })

        await sendMail({
            args: {
                email: existingUser?.email,
                template: "HomeownerAccountUnSuspended",
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

export async function approveHomeowner(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    const { id } = req.params
    const { user: _user } = req

    try {
        const existingUser = await HomeownerModel.findById(id)

        if (!existingUser) {
            return next(createError(404, "Account not found"))
        }

        if (_user.id === id) {
            return next(createError(401, "You can not suspend yourself"))
        }


        if (existingUser?.meta?.isApproved) {
            return next(createError(401, "Account has already been approved"))
        }
        
        const updatedUser = await HomeownerModel.findByIdAndUpdate(existingUser?._id, {
            meta: {
            isApproved: true
            }
        }, { new: true })

        await sendMail({
            args: {
                email: existingUser?.email,
                template: "HomeownerApproved",
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

export async function rejectHomeowner(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    const { id } = req.params
    const { user: _user } = req

    try {
        const existingUser = await HomeownerModel.findById(id)

        if (!existingUser) {
            return next(createError(404, "Account not found"))
        }

        if (_user.id === id) {
            return next(createError(401, "You can not suspend yourself"))
        }

        if (!existingUser?.meta?.isApproved) {
            return next(createError(401, "Account has already been rejected"))
        }
        
        const updatedUser = await HomeownerModel.findByIdAndUpdate(existingUser?._id, {
            meta: {
            isApproved: false
            }
        }, { new: true })

        await sendMail({
            args: {
                email: existingUser?.email,
                template: "HomeownerRejected",
                data: {
                    user: updatedUser,
                }
            }
        })
        
        res.status(200).json({
            success: true,
            message: 'Account rejected!',
            data: updatedUser,
        });

    } catch (error) {
        next(error)
    }

}

export async function deleteHomeowner(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
        if (!id) {
            return next(createError(400, 'Provide user id'));
        }

        const driver = await HomeownerModel.findById(id)

        if (!driver) {
            return next(createError(404, "Account not found"))
        }

        const deletedHomeowner = await HomeownerModel.findByIdAndDelete(id)

        res.status(200).json({
            success: true,
            message: 'Homeowner deleted successfully',
            data: deletedHomeowner,
        });
    } catch (error) {
        next(error)
    }
}