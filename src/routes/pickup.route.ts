import { Router } from 'express';
import { VerifyAccess, VerifyManager, VerifySudo } from '../middlewares';
import { createPickup, reschedulePickup, cancelPickup, assignPickupsAuto, viewPickupsByDay, viewOverduePickups, viewPickups, viewUserPickups, changePickupToCompleted, changePickupToOngoing } from '../controllers/pickup.controller';

const router = Router();

// /pickup
router.post("/", VerifyAccess, createPickup)

router.patch("/assign/auto", assignPickupsAuto)
router.patch("/reschedule/:id", VerifyAccess, reschedulePickup)
router.patch("/cancel/:id", VerifyAccess, cancelPickup)
router.patch("/complete/:id", VerifyAccess, changePickupToCompleted)
router.patch("/ongoing/:id", VerifyAccess, changePickupToOngoing)

router.get("/", viewPickups)
router.get("/user", VerifyAccess, viewUserPickups)
router.get("/overdue", viewOverduePickups)
router.get("/date/:date", viewPickupsByDay)





export default router;
