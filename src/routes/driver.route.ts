import { Router } from 'express';
import { VerifyAccess, VerifyManager, VerifySudo } from '../middlewares';
import { createDriver, getAllDrivers, getDriverById } from '../controllers/driver.controller';

const router = Router();

// /driver
router.post("/", VerifyAccess, VerifyManager, createDriver)
router.get("/", VerifyAccess, VerifyManager, getAllDrivers)
router.get("/:id", VerifyAccess, getDriverById)


export default router;
