import { createUser } from '../controllers/Auth/authController.js';
import { Router } from 'express';

import validateUser from '../middlewares/userMiddleware.js';

const router = Router();

router.post('/sign-up', validateUser, createUser);

export default router;
