import express from 'express'
import {
    deleteUser,
    googleReg,
    login,
    logout,
    register,
    test,
    updateUser
} from '../controller/userController.js';
import { verifyToken } from '../middleware/verifyUser.js';

// Init router
const router = express.Router();

// test route
router.get('/user/test', test)

// Registration 
router.post('/user/register', register)

// Google Registration 
router.post('/user/google', googleReg)

// Login 
router.post('/user/login', login)

// Update user details
router.put('/user/update/:id', verifyToken, updateUser)

// Logout
router.post('/user/logout', logout)

// Delete user 
router.delete('/user/delete/:id', verifyToken, deleteUser)

export default router;