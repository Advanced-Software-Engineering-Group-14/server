import { BinModel, DriverModel, HomeownerModel } from "../models"
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



