import { Router } from 'express';
import { VerifyAccess, VerifyManager, VerifySudo } from '../middlewares';
import { createHomeowner, deleteHomeowner, getAllHomeowners, getHomeownerById, suspendHomeowner, unsuspendHomeowner, approveHomeowner, rejectHomeowner, verifyHomeownerEmail } from '../controllers/homeowner.controller';

const router = Router();

// /homeowner

router.post("/", createHomeowner)
router.post("/verify", VerifyAccess, verifyHomeownerEmail)

router.get("/", VerifyAccess, VerifyManager, getAllHomeowners)
router.get("/:id", VerifyAccess, getHomeownerById)

router.patch("/suspend/:id", VerifyAccess, VerifyManager, suspendHomeowner)
router.patch("/unsuspend/:id", VerifyAccess, VerifyManager, unsuspendHomeowner)
router.patch("/approve/:id", VerifyAccess, VerifyManager, approveHomeowner)
router.patch("/reject/:id", VerifyAccess, VerifyManager, rejectHomeowner)

router.delete("/:id", VerifyAccess, VerifyManager, deleteHomeowner)


export default router;
