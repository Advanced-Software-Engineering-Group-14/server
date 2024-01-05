import { Router } from 'express';
import { VerifyAccess, VerifyManager, VerifySudo } from '../middlewares';
import {  createPickup, reschedulePickup, cancelPickup, assignPickupsAuto, viewPickupsByDay, viewOverduePickups} from '../controllers/pickup.controller';

const router = Router();

// /pickup
router.post("/", VerifyAccess, createPickup)

router.patch("/assign/auto", assignPickupsAuto)
router.patch("/reschedule/:id", VerifyAccess, reschedulePickup)
router.patch("/cancel/:id", VerifyAccess, cancelPickup)

router.get("/overdue", viewOverduePickups)
router.get("/date/:date", viewPickupsByDay)





export default router;
