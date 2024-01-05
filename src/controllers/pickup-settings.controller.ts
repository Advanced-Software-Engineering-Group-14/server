import { BinModel, BinPackageModel, BinPackagePaymentModel, DriverModel, HomeownerModel, PaymentModel, PickupModel } from "../models"
import { NextFunction, Request, Response } from 'express';
import { createError } from "../utils";
import _ from "lodash"
import { Bin, BinPackage, Payment, Pickup } from "../types";
import { __validObjectId } from "../helpers/object-id";
import dayjs from "dayjs";
import { PickupSettingsModel } from "../models/pickup-settings.model";

type PickupSettingsInput = {
    dailyPickupLimitPerDriver: number
    pickupPrice: number
}

export async function createPickupSetting(req: Request<{}, {}, PickupSettingsInput>, res: Response, next: NextFunction) {
    const { dailyPickupLimitPerDriver, pickupPrice } = req.body
    try {
        if (!dailyPickupLimitPerDriver || !pickupPrice) {
            return next(createError(400, "Provide all required fields"))
        }

        const settingExists = await PickupSettingsModel.findOne()

        if (settingExists) {
            return next(createError(409, "A setting record already exists. Edit that one instead"))
        }

        const newData = await PickupSettingsModel.create({
            dailyPickupLimitPerDriver,
            pickupPrice
        })

        res.status(200).json({
            success: true,
            message: 'Pickup setting creation successful!',
            data: newData,
        });
    } catch (error) {
        next(error)
    }
}

export async function updatePickupSetting(req: Request<{}, {}, PickupSettingsInput>, res: Response, next: NextFunction) {
    const { dailyPickupLimitPerDriver, pickupPrice } = req.body
    try {
        if (!dailyPickupLimitPerDriver || !pickupPrice) {
            return next(createError(400, "Provide all required fields"))
        }

        const settingExists = await PickupSettingsModel.findOne()

        if (!settingExists) {
            return next(createError(404, "There are no settings. Please create one"))
        }

    
        const newData = await PickupSettingsModel.findByIdAndUpdate(settingExists?._id, {
            dailyPickupLimitPerDriver,
            pickupPrice
        }, {new: true})

        res.status(200).json({
            success: true,
            message: 'Pickup setting update successful!',
            data: newData,
        });
    } catch (error) {
        next(error)
    }
}

export async function getPickupSetting(req: Request<{}, {}, PickupSettingsInput>, res: Response, next: NextFunction) {
    const { dailyPickupLimitPerDriver, pickupPrice } = req.body
    try {
        if (!dailyPickupLimitPerDriver || !pickupPrice) {
            return next(createError(400, "Provide all required fields"))
        }

        const settingExists = await PickupSettingsModel.findOne()

        if (!settingExists) {
            return next(createError(404, "There are no settings. Please create one"))
        }

        res.status(200).json({
            success: true,
            message: 'Pickup setting creation successful!',
            data: settingExists,
        });
    } catch (error) {
        next(error)
    }
}