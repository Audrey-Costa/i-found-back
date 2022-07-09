import {
  checkoutUser,
  createUser,
  loginUser
} from '../controllers/Auth/authController.js';
import { Router } from 'express';

import validateUserRegister from '../middlewares/userRegisterMiddleware.js';
import validateUserLogin from '../middlewares/userLoginMiddleware.js';
import authUser from '../middlewares/authTokenMiddleware.js';

const router = Router();

router.post('/sign-up', validateUserRegister, createUser);

router.post('/login', validateUserLogin, loginUser);

router.delete('/checkout', authUser, checkoutUser);

export default router;
