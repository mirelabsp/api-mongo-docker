import { Router } from 'express';
import { 
    addProduct, getAllProducts, addReview, getProductReviews, 
    deleteProduct, updateProduct, deleteReview 
} from '../controllers/productController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.get('/allProducts', getAllProducts);
router.get('/getProductReviews/:id', getProductReviews);
router.post('/addReview/:id', addReview);

router.post('/addProduct', protect, upload.single('image'), addProduct);
router.put('/updateProduct/:id', protect, upload.single('image'), updateProduct);
router.delete('/deleteProduct/:id', protect, deleteProduct);
router.delete('/reviews/:id', protect, deleteReview);

export default router;