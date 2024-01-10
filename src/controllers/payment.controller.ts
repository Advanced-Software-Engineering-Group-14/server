import { BinModel, BinPackageModel, BinPackagePaymentModel, DriverModel, HomeownerModel, PaymentModel, PickupModel } from "../models"
import { NextFunction, Request, Response } from 'express';
import { createError } from "../utils";
import _ from "lodash"
import { Bin, BinPackage, Payment } from "../types";
import { __validObjectId } from "../helpers/object-id";
import { sendMail } from "./mailer";

type BinPayment = Payment & {
    binPackage: string
}

export async function createPaymentForBinPackage(req: Request<{}, {}, BinPayment>, res: Response, next: NextFunction) {
    const { user: _user } = req
    const { paymentMethod, refNumber, response, totalAmount, binPackage } = req.body
    
    try {
        if (!paymentMethod || !refNumber || !response || !totalAmount || !binPackage) {
            return next(createError(400, "Provide all required fields"))
        }


        const existingUser = await HomeownerModel.findById(_user?.id).populate("package bins")
        if (!existingUser) {
            return next(createError(404, "Account not found"))
        }

        if (existingUser?.meta?.isSuspended) {
            return next(createError(401, "Account has been suspended"))
        }


        const packageExists = await BinPackageModel.findById(binPackage)

        if (!packageExists) {
            return next(createError(404, "Package does not exist"))
        }




        // if response is success, then check details of package and assign bins to user
        if (_.isEqual(response, "success")) {
            
            const validBins = await BinModel.find({
                homeowner: null,
                size: packageExists?.size
            })

            // check if the length of viable bins is greater or equal to package bin number
            if (validBins.length < packageExists?.binNum) {
                return next(createError(401, "There are not enough available bins."))
            }

            const usersBins = _.slice(validBins, 0, packageExists?.binNum - 1)

            // iterate over usersBins and set the homeowner of each one to existingUser?._id
            const binUpdatePromises = usersBins.map(async (bin) => {
                bin.homeowner = existingUser?._id;
                return bin.save();
            });
            await Promise.all(binUpdatePromises);

            const getUserBins = await BinModel.find({ homeowner: existingUser?._id })

            // update user with bins
            const updatedUser = await HomeownerModel.findByIdAndUpdate(_user?.id, {
                bins: getUserBins,
                package: binPackage
            }, {new:true})

            console.log(updatedUser)
        }

        const newData = await PaymentModel.create({
            paymentMethod,
            paymentType: "bin",
            refNumber,
            response,
            totalAmount,
            homeowner: existingUser?._id,
        })

        // create bin package model
        await BinPackagePaymentModel.create({
            homeowner: existingUser?._id,
            package: packageExists?._id,
            payment: newData?._id
        })


        await sendMail({
            args: {
                email: existingUser?.email,
                template: "PaymentReceipt",
                data: {
                    user: existingUser,
                    payment: newData
                }
            }
        })

        res.status(200).json({
            success: true,
            message: 'Payment creation successful!',
            data: newData,
        });


    } catch (error) {
        next(error)
    }

}

export async function createPaymentForPickup(req: Request<{ id: string }, {}, Payment>, res: Response, next: NextFunction) {
    const { user: _user } = req
    const { paymentMethod, refNumber, response, totalAmount } = req.body
    const { id } = req.params

    try {
        if (!paymentMethod || !refNumber || !response || !totalAmount || !id) {
            return next(createError(400, "Provide all required fields"))
        }


        const existingUser = await HomeownerModel.findById(_user?.id).populate("package bins")
        if (!existingUser) {
            return next(createError(404, "Account not found"))
        }

        if (existingUser?.meta?.isSuspended) {
            return next(createError(401, "Account has been suspended"))
        }

        const pickupExists = await PickupModel.findById(id)

        if (!pickupExists) {
            return next(createError(404, "Pickup not found"))
        }

        if (_.toString(pickupExists.homeowner) !== _user?.id) {
            return next(createError(400, 'This user is not associated with this pickup'));
        }

        if (pickupExists.status !== "completed") {
            return next(createError(400, 'You can only pay after pickup is completed'));
        }

        const newData = await PaymentModel.create({
            paymentMethod,
            refNumber,
            response,
            totalAmount,
            paymentType: "pickup",
            homeowner: existingUser?._id,
        })

        await PickupModel.findByIdAndUpdate(id, { status: "paid" }, { new: true })

        await sendMail({
            args: {
                email: existingUser?.email,
                template: "PaymentReceipt",
                data: {
                    user: existingUser,
                    payment: newData
                }
            }
        })

        res.status(200).json({
            success: true,
            message: 'Payment creation successful!',
            data: newData,
        });


    } catch (error) {
        next(error)
    }
}

export async function viewAllPayments(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
    try {
        const payments = await PaymentModel.find().populate("homeowner")

        res.status(200).json({
            success: true,
            message: 'Payments fetched successfully',
            data: payments,
        });
    } catch (error) {
        next(error)
    }
}

export async function viewPaymentsByHomeowner(req: Request<{ id: string }, {}, {}>, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
        if (!id) {
            return next(createError(400, "Provide homeowner id"))
        }

        const existingUser = await HomeownerModel.findById(id).populate("package bins")
        if (!existingUser) {
            return next(createError(404, "Account not found"))
        }

        const payments = await PaymentModel.find({ homeowner: id }).populate("homeowner")

        res.status(200).json({
            success: true,
            message: 'Payments fetched successfully',
            data: payments,
        });
    } catch (error) {
        next(error)
    }
}

export async function viewCurrentUserPayments(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
    const { user: _user } = req
    try {
        const payments = await PaymentModel.find({ homeowner: _user?.id })

        res.status(200).json({
            success: true,
            message: 'Payments fetched successfully',
            data: payments,
        });
    } catch (error) {
        next(error)
    }
}