import { BinModel, BinPackageModel, BinPackagePaymentModel, DriverModel, HomeownerModel, PaymentModel } from "../models"
import { NextFunction, Request, Response } from 'express';
import { createError } from "../utils";
import _ from "lodash"
import { Bin, BinPackage, Payment } from "../types";
import { __validObjectId } from "../helpers/object-id";


export async function createPaymentForBinPackage(req: Request<{ packageId: string }, {}, Payment>, res: Response, next: NextFunction) {
    const { user: _user } = req
    const { packageId } = req.params
    const { paymentMethod, refNumber, response, totalAmount } = req.body
    try {
        if (!paymentMethod || !refNumber || !response || !totalAmount) {
            return next(createError(400, "Provide all required fields"))
        }

        if (!packageId) {
            return next(createError(400, "Provide the package id"))
        }

        const packageExists = await BinPackageModel.findById(packageId)

        if (!packageExists) {
            return next(createError(404, "Package does not exist"))
        }

        const existingUser = await HomeownerModel.findById(_user?.id)
        if (!existingUser) {
            return next(createError(404, "Account not found"))
        }

        if (existingUser?.meta?.isSuspended) {
            return next(createError(401, "Account has been suspended"))
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
            const updatedUser = await HomeownerModel.findByIdAndUpdate(_user?.id, { bins: getUserBins })


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
            package: packageId,
            payment: newData?._id
        })


    } catch (error) {
        next(error)
    }

}