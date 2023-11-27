import { Router } from 'express';
import { VerifyAccess, VerifyManager, VerifySudo } from '../middlewares';
import { createDriver, getAllDrivers, getDriverById, deleteDriver, suspendDriver, unsuspendDriver } from '../controllers/driver.controller';

const router = Router();

// /driver
router.post("/", VerifyAccess, VerifyManager, createDriver)

router.get("/", VerifyAccess, VerifyManager, getAllDrivers)
router.get("/:id", VerifyAccess, getDriverById)

router.patch("/suspend/:id", VerifyAccess, VerifyManager, suspendDriver)
router.patch("/unsuspend/:id", VerifyAccess, VerifyManager, unsuspendDriver)

router.delete("/:id", VerifyAccess, VerifyManager, deleteDriver)



export default router;
