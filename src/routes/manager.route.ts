import { Router } from 'express';
import { VerifyAccess, VerifyManager, VerifySudo } from '../middlewares';
import { createManager, suspendManager, unsuspendManager, updateManagerPassword } from '../controllers/manager.controller';

const router = Router();

// /manager
router.post("/", VerifyAccess, VerifySudo, createManager)
router.post("/change-password", VerifyAccess, VerifyManager, updateManagerPassword)
router.patch("/suspend/:id", VerifyAccess, VerifySudo, suspendManager)
router.patch("/unsuspend/:id", VerifyAccess, VerifySudo, unsuspendManager)


export default router;