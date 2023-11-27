import { Router } from 'express';
import { VerifyAccess } from '../middlewares';
import { createManager } from '../controllers/manager.controller';

const router = Router();

router.post("/", createManager)


export default router;