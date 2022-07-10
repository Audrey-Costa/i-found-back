import { Router } from 'express';
import {
  getProducts,
  registerProduct
} from '../controllers/Products/productsController.js';
import authUser from '../middlewares/authMiddleware.js';
import validateRegisterProduct from '../middlewares/registerProductMiddleware.js';

const router = Router();

router.post('/register-product', validateRegisterProduct, authUser, registerProduct);

router.get('/products', getProducts);
export default router;
