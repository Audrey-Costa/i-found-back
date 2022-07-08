import { createUser, loginUser } from '../controllers/Auth/authController.js';
import { Router } from 'express';

import validateUserRegister from '../middlewares/userRegisterMiddleware.js';
import validateUserLogin from '../middlewares/userLoginMiddleware.js';

const router = Router();

router.post('/sign-up', validateUserRegister, createUser);

router.post('/login', validateUserLogin, loginUser);

export default router;
