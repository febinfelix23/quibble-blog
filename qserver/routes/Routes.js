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
import { createPost, deletePost, getPosts, updatePost, } from '../controller/postController.js';

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

// Create blog post
router.post('/post/create', verifyToken, createPost)

// Get posts
router.get('/post/getposts', getPosts)

// Delete post
router.delete('/post/delete/:postId/:userId', verifyToken, deletePost)

// Update post
router.put('/post/update/:postId/:userId', verifyToken, updatePost)

export default router;