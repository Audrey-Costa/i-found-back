import { Router } from 'express';
import {
  getCategories,
  getProducts,
  registerProduct
} from '../controllers/Products/productsController.js';
import authUser from '../middlewares/authMiddleware.js';
import validateRegisterProduct from '../middlewares/registerProductMiddleware.js';

const router = Router();

router.post('/register-product', validateRegisterProduct, authUser, registerProduct);

router.get('/products', getProducts);

router.get('/categories', getCategories);
export default router;
