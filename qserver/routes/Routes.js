import express from 'express'
import { login, register, test } from '../controller/userController.js';

// Init router
const router = express.Router();

// test route
router.get('/user/test', test)

// Registration 
router.post('/user/register', register)

// Login 
router.post('/user/login', login)

export default router;