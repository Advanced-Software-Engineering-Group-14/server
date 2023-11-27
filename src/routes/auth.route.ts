// 
import { Router } from 'express';
import { loginManager, resetManagerPassword, sendManagerCode, verifyManagerCode } from '../controllers/auth.controller';

const router = Router();

// /auth - manager
router.post("/manager/login", loginManager)
router.post("/manager/reset-password", resetManagerPassword)
router.post("/manager/send-code", sendManagerCode)
router.post("/manager/verify-code", verifyManagerCode)



export default router;
