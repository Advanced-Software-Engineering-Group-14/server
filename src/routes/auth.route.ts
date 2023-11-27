// 
import { Router } from 'express';
import { loginDriver, loginManager, resetDriverPassword, resetManagerPassword, sendDriverCode, sendManagerCode, verifyDriverCode, verifyManagerCode, loginHomeowner, resetHomeownerPassword, sendHomeownerCode, verifyHomeownerCode } from '../controllers/auth.controller';

const router = Router();

// /auth - manager
router.post("/manager/login", loginManager)
router.post("/manager/reset-password", resetManagerPassword)
router.post("/manager/send-code", sendManagerCode)
router.post("/manager/verify-code", verifyManagerCode)

// /auth - driver

router.post("/driver/login", loginDriver)
router.post("/driver/reset-password", resetDriverPassword)
router.post("/driver/send-code", sendDriverCode)
router.post("/driver/verify-code", verifyDriverCode)


// /auth - homeowner

router.post("/homeowner/login", loginHomeowner)
router.post("/homeowner/reset-password", resetHomeownerPassword)
router.post("/homeowner/send-code", sendHomeownerCode)
router.post("/homeowner/verify-code", verifyHomeownerCode)


export default router;
