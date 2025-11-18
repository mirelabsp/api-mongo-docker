import { Router } from 'express';
import { getAppStatus } from '../controllers/statusController';
import { protect } from '../middleware/authMiddleware';

const router = Router();
router.get('/', protect, getAppStatus);

export default router;