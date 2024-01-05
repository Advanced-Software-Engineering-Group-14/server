import { BinModel, DriverModel, HomeownerModel, PickupModel } from "../models"
import { NextFunction, Request, Response } from 'express';
import { createError } from "../utils";
import _ from "lodash"
import { Bin } from "../types";
import { __validObjectId } from "../helpers/object-id";

type CreateBinInput = Pick<Bin, "category" | "price" | "size">
type CreateMultipleBinInput = CreateBinInput & {
    count: number
}

export async function createSingleBin(req: Request<{}, {}, CreateBinInput>, res: Response, next: NextFunction) {
    const { category, price, size } = req.body
    try {
        if (!category || !price || !size) {
            return next(createError(400, 'Provide all required fields'));
        }

        const newData = await BinModel.create({
            category,
            price,
            size,
        })


        res.status(201).json({
            success: true,
            data: newData,
        });

    } catch (error) {
        next(error)
    }
}

export async function createMultipleBins(req: Request<{}, {}, CreateMultipleBinInput>, res: Response, next: NextFunction) {
    const { category, price, size, count } = req.body
    try {
        if (!category || !price || !size || !count) {
            return next(createError(400, 'Provide all required fields'));
        }

        const binData = {
            category,
            price,
            size,
        }

        const binsArray = Array.from({ length: count }, () => binData);

        // console.log(binsArray)

        const newData = await BinModel.create(binsArray)

        res.status(201).json({
            success: true,
            data: newData,
        });

    } catch (error) {
        next(error)
    }
}

export async function deleteBin(req: Request<{ id: string }, {}, {}>, res: Response, next: NextFunction) {
    const { id } = req.params
    try {
        if (!id) {
            return next(createError(400, 'Provide all required fields'));
        }

        if (!__validObjectId(id)) {
            return next(createError(400, 'Enter a valid object id'));
        }

        const binExists = await BinModel.findById(id)

        if (!binExists) {
            return next(createError(404, "Bin does not exist"))
        }

        // check if bin is assinged to homeowner
        const isAssigned = binExists?.homeowner

        if (isAssigned) {
            return next(createError(403, "This bin is already assigned to a homeowner"))
        }


        const newData = await BinModel.findByIdAndDelete(binExists)

        res.status(200).json({
            success: true,
            data: newData,
        });

    } catch (error) {
        next(error)
    }
}

export async function getSingleBin(req: Request<{ id: string }, {}, {}>, res: Response, next: NextFunction) {
    const { id } = req.params

    try {
        if (!id) {
            return next(createError(400, 'Provide all required fields'));
        }

        if (!__validObjectId(id)) {
            return next(createError(400, 'Enter a valid object id'));
        }

        const binExists = await BinModel.findById(id)

        if (!binExists) {
            return next(createError(404, "Bin does not exist"))
        }

        res.status(200).json({
            success: true,
            data: binExists,
        });

    } catch (error) {
        next(error)
    }
}

export async function getBins(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {

    try {
        const newData = await BinModel.find()

        res.status(200).json({
            success: true,
            data: newData,
        });

    } catch (error) {
        next(error)
    }
}

export async function getCurrentUserBins(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
    const { user: _user } = req
    try {
        const newData = await BinModel.find({ homeowner: _user?.id })

        res.status(200).json({
            success: true,
            data: newData,
        });

    } catch (error) {
        next(error)
    }
}


export async function getBinsByHomeowner(req: Request<{ homeowner: string }, {}, {}>, res: Response, next: NextFunction) {
    const { homeowner } = req.params
    try {
        if (!homeowner) {
            return next(createError(400, 'Provide all required fields'));
        }

        if (!__validObjectId(homeowner)) {
            return next(createError(400, 'Enter a valid object id'));
        }

        const homeownerExists = await HomeownerModel.findById(homeowner)

        if (!homeownerExists) {
            return next(createError(404, "Homeowner does not exist"))
        }

        const newData = await BinModel.find({ homeowner })

        res.status(200).json({
            success: true,
            data: newData,
        });

    } catch (error) {
        next(error)
    }
}

export async function getUnassignedBins(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
    try {
        const newData = await BinModel.find({ homeowner: null })

        res.status(200).json({
            success: true,
            data: newData,
        });

    } catch (error) {
        next(error)
    }
}

export async function getAssignedBins(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
    try {
        const newData = await BinModel.find({ homeowner: { $ne: null } })

        res.status(200).json({
            success: true,
            data: newData,
        });

    } catch (error) {
        next(error)
    }
}


// make all current user bins full
export async function fillCurrentUserBins(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
    const { user: _user } = req
    try {
        if (!_user) {
            return next(createError(400, "Please log in again"))
        }

        const homeownerExists = await HomeownerModel.findById(_user.id)

        if (!homeownerExists) {
            return next(createError(404, "Homeowner does not exist"))
        }

        // Check if there is a record in PickupModel associated with _user.id
        const existingPickup = await PickupModel.findOne({
            homeowner: _user.id,
            status: { $nin: ['cancelled', 'completed'] },
        });

        if (existingPickup) {
            return next(createError(400, 'Current pickup must be cancelled or completed before updating bins.'));
        }

        // Find all bins associated with the current homeowner
        const userBins = await BinModel.find({ homeowner: _user.id });

        // Update the status of each bin to 'full'
        await Promise.all(
            userBins.map(async (bin: any) => {
                bin.status = 'full';
                await bin.save();
            })
        );



        const newData = await BinModel.find({ homeowner:  _user.id })

        res.status(200).json({
            success: true,
            data: newData,
        });

    } catch (error) {
        next(error)
    }
}


// make all current user bins empty

export async function emptyCurrentUserBins(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
    const { user: _user } = req
    try {
        if (!_user) {
            return next(createError(400, "Please log in again"))
        }

        const homeownerExists = await HomeownerModel.findById(_user.id)

        if (!homeownerExists) {
            return next(createError(404, "Homeowner does not exist"))
        }

        // Check if there is a record in PickupModel associated with _user.id
        const existingPickup = await PickupModel.findOne({
            homeowner: _user.id,
            status: { $nin: ['cancelled', 'completed'] },
        });

        if (existingPickup) {
            return next(createError(400, 'Current pickup must be cancelled or completed before updating bins.'));
        }

        // Find all bins associated with the current homeowner
        const userBins = await BinModel.find({ homeowner: _user.id });

        // Update the status of each bin to 'empty'
        await Promise.all(
            userBins.map(async (bin: any) => {
                bin.status = 'empty';
                await bin.save();
            })
        );



        const newData = await BinModel.find({ homeowner: _user.id })

        res.status(200).json({
            success: true,
            data: newData,
        });

    } catch (error) {
        next(error)
    }
}

// make single bin full
export async function fillSingleBin(req: Request<{ id: string }, {}, {}>, res: Response, next: NextFunction) {
    const { id } = req.params
    const { user: _user } = req

    try {
        if (!_user) {
            return next(createError(400, "Please log in again"))
        }

        const homeownerExists = await HomeownerModel.findById(_user.id)

        if (!homeownerExists) {
            return next(createError(404, "Homeowner does not exist"))
        }

        if (!id) {
            return next(createError(400, 'Provide all required fields'));
        }

        if (!__validObjectId(id)) {
            return next(createError(400, 'Enter a valid object id'));
        }

        const binExists = await BinModel.findById(id) as any

        if (!binExists) {
            return next(createError(404, "Bin does not exist"))
        }

        if (_.toString(binExists.homeowner) !== _user?.id) {
            return next(createError(400, 'This user is not associated with this bin'));
        }

        // Check if there is a record in PickupModel associated with _user.id
        const existingPickup = await PickupModel.findOne({
            homeowner: _user.id,
            status: { $nin: ['cancelled', 'completed'] },
        });

        if (existingPickup) {
            return next(createError(400, 'Current pickup must be cancelled or completed before updating bins.'));
        }

        const newData = await BinModel.findByIdAndUpdate(id, {
            status: "full"
        }, {new: true})


        res.status(200).json({
            success: true,
            data: newData,
        });

    } catch (error) {
        next(error)
    }
}

// make single bin empty

export async function emptySingleBin(req: Request<{ id: string }, {}, {}>, res: Response, next: NextFunction) {
    const { id } = req.params
    const { user: _user } = req

    try {
        if (!_user) {
            return next(createError(400, "Please log in again"))
        }

        const homeownerExists = await HomeownerModel.findById(_user.id)

        if (!homeownerExists) {
            return next(createError(404, "Homeowner does not exist"))
        }

        if (!id) {
            return next(createError(400, 'Provide all required fields'));
        }

        if (!__validObjectId(id)) {
            return next(createError(400, 'Enter a valid object id'));
        }

        const binExists = await BinModel.findById(id) as any

        if (!binExists) {
            return next(createError(404, "Bin does not exist"))
        }

        if (_.toString(binExists.homeowner) !== _user?.id) {
            return next(createError(400, 'This user is not associated with this bin'));
        }

        // Check if there is a record in PickupModel associated with _user.id
        const existingPickup = await PickupModel.findOne({
            homeowner: _user.id,
            status: { $nin: ['cancelled', 'completed'] },
        });

        if (existingPickup) {
            return next(createError(400, 'Current pickup must be cancelled or completed before updating bins.'));
        }

        const newData = await BinModel.findByIdAndUpdate(id, {
            status: "empty"
        }, {new: true})


        res.status(200).json({
            success: true,
            data: newData,
        });

    } catch (error) {
        next(error)
    }
}
