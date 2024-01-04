import { BinModel, BinPackageModel, BinPackagePaymentModel, DriverModel, HomeownerModel, PaymentModel , PickupModel} from "../models"
import { NextFunction, Request, Response } from 'express';
import { createError } from "../utils";
import _ from "lodash"
import { Bin, BinPackage, Payment, Pickup } from "../types";
import { __validObjectId } from "../helpers/object-id";
import dayjs from "dayjs";


export async function createPickup(req: Request<{}, {}, Pickup>, res: Response, next: NextFunction) { 
    const { bins, date, driver, homeowner, payment, status } = req.body
    const {user: _user} = req
    try {
        if (!bins || !date) {
            return next(createError(400, "Provide all required fields"))
        }
        const existingUser = await HomeownerModel.findById(_user?.id).populate("package bins")
        if (!existingUser) {
            return next(createError(404, "Account not found"))
        }

        if (existingUser?.meta?.isSuspended) {
            return next(createError(401, "Account has been suspended"))
        }

        // check if there is a pickup request with status not equal to "cancelled", "paid"

         // Check if the date is a weekend (Saturday or Sunday)
         const isWeekendDate = dayjs(date).day() === 0 || dayjs(date).day() === 6;

         if (isWeekendDate) {
             return next(createError(400, "Selected date is a weekend. Please choose a weekday."));
         }
 
         // Check if the date is less than the current date
         const currentDate = dayjs();
         if (dayjs(date).isBefore(currentDate, 'day')) {
             return next(createError(400, "Selected date is in the past. Please choose a future date."));
         }
        
         if (bins.some(bin => bin.status !== 'full')) {
            return next(createError(400, 'All bins must have an "full" status for pickup.'));
        }
        
        const newPickup = await PickupModel.create({
            date,
            bins,
            homeowner: _user?.id,
        })


        res.status(200).json({
            success: true,
            message: 'Payment creation successful!',
            data: newPickup,
        });

    } catch (error) {
     next(error)   
    }

}