import { Router } from 'express';
import { VerifyAccess, VerifyManager, VerifySudo } from '../middlewares';
import { createPaymentForBinPackage } from '../controllers/payment.controller';

const router = Router();

// /payment
router.post("/bin-package/:packageId", VerifyAccess, createPaymentForBinPackage  )





export default router;
