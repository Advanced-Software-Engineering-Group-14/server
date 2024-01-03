import { Router } from 'express';
import { VerifyAccess, VerifyManager, VerifySudo } from '../middlewares';
import { createSingleBin, createMultipleBins, deleteBin, getSingleBin, getBins, getAssignedBins, getBinsByHomeowner, getUnassignedBins } from '../controllers/bin.controller';

const router = Router();

// /bin
router.post("/",  createSingleBin)
router.post("/multiple", createMultipleBins)

router.get("/", getBins)
router.get("/assigned", getAssignedBins)
router.get("/unassigned", getUnassignedBins)
router.get("/homeowner/:homeowner", getBinsByHomeowner)
router.get("/:id", getSingleBin)

router.delete("/:id", deleteBin)





export default router;
