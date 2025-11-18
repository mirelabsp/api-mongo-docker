import { Router } from 'express';
import { placeOrder } from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, placeOrder);

export default router;
