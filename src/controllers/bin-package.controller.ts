import { BinModel, BinPackageModel, DriverModel, HomeownerModel } from "../models"
import { NextFunction, Request, Response } from 'express';
import { createError } from "../utils";
import _ from "lodash"
import { Bin, BinPackage } from "../types";
import { __validObjectId } from "../helpers/object-id";

type CreateBinInput = Pick<BinPackage, "name" | "price" | "binNum"| "size">


export async function createBinPackage(req: Request<{}, {}, CreateBinInput>, res: Response, next: NextFunction) {
    const { name, price, binNum, size } = req.body
    try {
        if (!name || !price || !binNum || !size) {
            return next(createError(400, 'Provide all required fields'));
        }

        const newData = await BinPackageModel.create({
            name,
            price,
            size,
            binNum,
        })


        res.status(201).json({
            success: true,
            data: newData,
        });

    } catch (error) {
        next(error)
    }
}

export async function createCustomBinPackage(req: Request<{}, {}, CreateBinInput>, res: Response, next: NextFunction) {
    const { name, price, binNum, size } = req.body
    try {
        if (!name || !price || !binNum) {
            return next(createError(400, 'Provide all required fields'));
        }

        const newData = await BinPackageModel.create({
            name,
            price,
            binNum,
            size,
            isCustom: true
        })


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

        const binExists = await BinPackageModel.findById(id)

        if (!binExists) {
            return next(createError(404, "Bin package does not exist"))
        }

        // find a user with that package
        const userWithPackageExists = await HomeownerModel.findOne({ package: id })
        
        if (userWithPackageExists) {
            return next(createError(403, "There are users on this package"))
        }

        const newData = await BinPackageModel.findByIdAndDelete(binExists)

        res.status(200).json({
            success: true,
            data: newData,
        });

    } catch (error) {
        next(error)
    }
}

export async function getSinglePackage(req: Request<{ id: string }, {}, {}>, res: Response, next: NextFunction) {
    const { id } = req.params

    try {
        if (!id) {
            return next(createError(400, 'Provide all required fields'));
        }

        if (!__validObjectId(id)) {
            return next(createError(400, 'Enter a valid object id'));
        }

        const binExists = await BinPackageModel.findById(id)

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

export async function getPackages(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {

    try {
        const newData = await BinPackageModel.find({isCustom: false})

        res.status(200).json({
            success: true,
            data: newData,
        });

    } catch (error) {
        next(error)
    }
}




