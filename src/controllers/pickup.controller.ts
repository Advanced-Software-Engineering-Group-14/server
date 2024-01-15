import { BinModel, BinPackageModel, BinPackagePaymentModel, DriverModel, HomeownerModel, PaymentModel, PickupModel } from "../models"
import { NextFunction, Request, Response } from 'express';
import { createError } from "../utils";
import _ from "lodash"
import { Bin, BinPackage, Payment, Pickup } from "../types";
import { __validObjectId } from "../helpers/object-id";
import dayjs from "dayjs";
import { PickupSettingsModel } from "../models/pickup-settings.model";

type CreatePickupInput = {
    date: Date
}

export async function createPickup(req: Request<{}, {}, CreatePickupInput>, res: Response, next: NextFunction) {
    const { date } = req.body
    const { user: _user } = req
    try {
        if (!date) {
            return next(createError(400, "Provide all required fields"))
        }

        const existingUser = await HomeownerModel.findById(_user?.id).populate("package bins")
        if (!existingUser) {
            return next(createError(404, "Account not found"))
        }

        if (existingUser?.meta?.isSuspended) {
            return next(createError(401, "Account has been suspended"))
        }

        // check if there is a pickup request with status not equal to "cancelled", "paid" associated to _user?.id
        const existingPickup = await PickupModel.findOne({
            homeowner: _user?.id,
            status: { $nin: ['cancelled', 'paid'] },
        });

        if (existingPickup) {
            return next(createError(400, 'There is an existing active pickup request for this user.'));
        }

        const bins = await BinModel.find({
            homeowner: _user?.id,
            status: "full"
        })
        console.log(bins)
        if (!bins || bins?.length === 0) {
            return next(createError(400, "There are no full bins"))
        }

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



        const newData = await PickupModel.create({
            date,
            bins,
            homeowner: _user?.id,
        })


        res.status(200).json({
            success: true,
            message: 'Pickup creation successful!',
            data: newData,
        });

    } catch (error) {
        next(error)
    }

}

export async function reschedulePickup(req: Request<{ id: string }, {}, CreatePickupInput>, res: Response, next: NextFunction) {
    const { date } = req.body
    const { user: _user } = req
    const { id } = req.params

    try {
        if (!date || !id) {
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

        if (pickupExists.status !== "pending") {
            return next(createError(401, "This pickup is already in progress and can not be changed"))
        }

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


        const newData = await PickupModel.findByIdAndUpdate(id, { date }, { new: true }).populate("homeowner payment driver bins")

        res.status(200).json({
            success: true,
            message: 'Pickup reschedule successful!',
            data: newData,
        });

    } catch (error) {
        next(error)
    }
}

export async function cancelPickup(req: Request<{ id: string }, {}, {}>, res: Response, next: NextFunction) {
    const { user: _user } = req
    const { id } = req.params

    try {
        if (!id) {
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

        if (pickupExists.status !== "pending") {
            return next(createError(401, "This pickup is already in progress and can not be changed"))
        }


        const newData = await PickupModel.findByIdAndUpdate(id, { status: "cancelled" }, { new: true }).populate("homeowner payment driver bins")

        res.status(200).json({
            success: true,
            message: 'Pickup cancellation successful!',
            data: newData,
        });

    } catch (error) {
        next(error)
    }
}

export async function assignPickupsAuto(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
    try {

        const settings = await PickupSettingsModel.findOne()

        if (!settings) {
            return next(createError(404, "There are no settings. Create one to proceed"))
        }

        const drivers = await DriverModel.find()
        const unassignedPickups = await PickupModel.find({ status: "pending" })
        const maxPickupPerDriver = settings.dailyPickupLimitPerDriver

        if (!unassignedPickups || unassignedPickups.length === 0) {
            return next(createError(400, "There are no unassigned pickups"))
        }

        // const allDriversFull = drivers.every((driver) => {
        //     const driverPickupsOnDate = unassignedPickups.filter(
        //         (pickup) => pickup.driver?.toString() === driver._id.toString() && pickup.date === pickup.date
        //     );
        //     return driverPickupsOnDate.length >= maxPickupPerDriver;
        // });

        // if (allDriversFull) {
        //     return next(createError(400, 'All drivers have reached their maximum daily pickup limit.'));
        // }

        for (const pickup of unassignedPickups) {
            const shuffledDrivers = drivers.sort(() => Math.random() - 0.5);

            for (const driver of shuffledDrivers) {
                // Check if the driver has less pickups than maxPickupPerDriver with the pickup date
                const driverPickupsOnDate = await PickupModel.find({
                    driver: driver._id,
                    date: pickup.date,
                });

                if (driverPickupsOnDate.length < maxPickupPerDriver) {
                    await PickupModel.findByIdAndUpdate(pickup._id, {
                        driver: driver._id,
                        status: 'assigned',
                    });

                    break; 
                }
            }
        }

        const newData = await PickupModel.find().populate("homeowner payment driver bins")

        res.status(200).json({
            success: true,
            message: 'Pickup assignment successful!',
            data: newData,
        });


    } catch (error) {
        next(error)
    }
}

export async function viewPickupsByDay(req: Request<{ date: string }, {}, {}>, res: Response, next: NextFunction) {
    const { date } = req.params;

    try {
        // Check if the date is provided
        if (!date) {
            return next(createError(400, 'Please provide a valid date.'));
        }

        // Parse and format the date
        const formattedDate = dayjs(date).format('YYYY-MM-DD');

        // Check if the formatted date is valid
        if (!formattedDate || !dayjs(formattedDate).isValid()) {
            return next(createError(400, 'Invalid date format. Please use YYYY-MM-DD.'));
        }

        // Find pickups for the formatted date
        const pickups = await PickupModel.find({ date: formattedDate }).populate("homeowner payment driver bins");

        res.status(200).json({
            success: true,
            message: 'Pickup assignment successful!',
            data: pickups,
        });
    } catch (error) {
        next(error);
    }
}

export async function viewOverduePickups(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
    try {
        const overduePickups = await PickupModel.find({
            status: { $nin: ['cancelled', 'completed'] },
            date: { $lt: dayjs().format('YYYY-MM-DD') },
        }).populate("homeowner payment driver bins");

        res.status(200).json({
            success: true,
            message: 'Pickup assignment successful!',
            data: overduePickups,
        });
    } catch (error) {
        next(error);
    }
}

export async function viewPickups(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
    try {
        const pickups = await PickupModel.find().populate("homeowner payment driver bins");

        res.status(200).json({
            success: true,
            message: 'Pickup assignment successful!',
            data: pickups,
        });
    } catch (error) {
        next(error);
    }
}

export async function viewUserPickups(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
    const {user: _user} = req
    try {
        const userExists = HomeownerModel.findById(_user.id)

        if (!userExists) {
            return next(createError(404, 'User does not exist.'));
        }
        const pickups = await PickupModel.find({homeowner: _user.id}, ).populate("homeowner payment driver bins");

        res.status(200).json({
            success: true,
            message: 'Pickup assignment successful!',
            data: pickups,
        });
    } catch (error) {
        next(error);
    }
}