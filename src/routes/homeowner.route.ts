import { Router } from 'express';
import { VerifyAccess, VerifyManager, VerifySudo } from '../middlewares';
import { createHomeowner } from '../controllers/homeowner.controller';

const router = Router();

// /homeowner

router.post("/", createHomeowner)


export default router;
