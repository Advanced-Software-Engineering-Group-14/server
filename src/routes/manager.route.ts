import { Router } from 'express';
import { VerifyAccess, VerifyManager } from '../middlewares';
import { createManager, updateManagerPassword } from '../controllers/manager.controller';

const router = Router();

router.post("/", createManager)
router.post("/change-password", VerifyAccess, VerifyManager, updateManagerPassword)


export default router;