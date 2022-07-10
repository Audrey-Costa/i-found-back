import { Router } from 'express';
import {
  getCategories,
  getProducts,
  getProductsForCategory,
  registerProduct
} from '../controllers/Products/productsController.js';
import authUser from '../middlewares/authMiddleware.js';
import validateRegisterProduct from '../middlewares/registerProductMiddleware.js';

const router = Router();

router.post('/register-product', registerProduct);

router.get('/products', getProducts);

router.get('/categories', getCategories);

router.get('/products/:category', getProductsForCategory);

export default router;
