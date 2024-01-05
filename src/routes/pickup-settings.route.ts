import { Router } from 'express';
import { VerifyAccess, VerifyManager, VerifySudo } from '../middlewares';
import { createPickupSetting, updatePickupSetting, getPickupSetting } from '../controllers/pickup-settings.controller';

const router = Router();

// /pickup-settings
router.post("/", createPickupSetting )
router.patch("/", updatePickupSetting )
router.get("/", getPickupSetting )





export default router;
