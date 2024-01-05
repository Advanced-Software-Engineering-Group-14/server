import { Router } from 'express';
import { VerifyAccess, VerifyManager, VerifySudo } from '../middlewares';
import { createSingleBin, createMultipleBins, deleteBin, getSingleBin, getBins, getAssignedBins, getBinsByHomeowner, getUnassignedBins, getCurrentUserBins, emptyCurrentUserBins, emptySingleBin, fillCurrentUserBins, fillSingleBin} from '../controllers/bin.controller';

const router = Router();

// /bin
router.post("/",  createSingleBin)
router.post("/multiple", createMultipleBins)

router.get("/", getBins)
router.get("/user", VerifyAccess, getCurrentUserBins)
router.get("/assigned", getAssignedBins)
router.get("/unassigned", getUnassignedBins)
router.get("/homeowner/:homeowner", getBinsByHomeowner)
router.get("/:id", getSingleBin)

router.patch("/fill", VerifyAccess, fillCurrentUserBins)
router.patch("/fill/:id", VerifyAccess, fillSingleBin)
router.patch("/empty", VerifyAccess, emptyCurrentUserBins)
router.patch("/empty/:id", VerifyAccess, emptySingleBin)

router.delete("/:id", deleteBin)





export default router;
