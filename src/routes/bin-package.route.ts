import { Router } from 'express';
import { VerifyAccess, VerifyManager, VerifySudo } from '../middlewares';
import { createBinPackage, createCustomBinPackage, deleteBin, getPackages, getSinglePackage } from '../controllers/bin-package.controller';

const router = Router();

// /bin-package
router.post("/", createBinPackage)
router.post("/custom", createCustomBinPackage)

router.get("/", getPackages)
router.get("/:id", getSinglePackage)

router.delete("/:id", deleteBin)




export default router;
