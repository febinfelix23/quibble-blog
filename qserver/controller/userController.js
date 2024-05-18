import { errorHandler } from '../middleware/errorMiddleware.js'
import User from '../models/userModel.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

// test
export const test = (req, res) => {
    res.json({ message: 'API is working' })
}

// Registration
export const register = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        next(errorHandler(400, 'Please fill the empty fields'))
    }
    else {
        try {
            const hashedPassword = bcryptjs.hashSync(password, 10);

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
            })

            await newUser.save();
            res.status(200).json({ message: 'Signup successful!' })

        } catch (error) {
            next(error)
        }
    }
}

// login
export const login = async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        next(errorHandler(400, 'Please fill the empty fields'))
    }
    else {
        try {
            const validUser = await User.findOne({ email })
            if (!validUser || !bcryptjs.compareSync(password, validUser.password)) {
                return next(errorHandler(403, 'Invalid username/password'))
            }

            const token = jwt.sign({ userId: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET)
            const { password: pass, ...rest } = validUser._doc
            res.status(200).cookie('auth_token', token, { httpOnly: true }).json(rest)

        } catch (error) {
            next(error)
        }
    }
}

// Google Registration 
export const googleReg = async (req, res, next) => {
    const { email, name, profileImgURL } = req.body

    try {
        const validUser = await User.findOne({ email })
        if (validUser) {
            const token = jwt.sign({ userId: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET)
            const { password: pass, ...rest } = validUser._doc
            res.status(200).cookie('auth_token', token, { httpOnly: true }).json(rest)
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: profileImgURL,
            });
            await newUser.save()
            const token = jwt.sign({ userId: newUser._id, newUser: validUser.isAdmin }, process.env.JWT_SECRET)
            const { password: pass, ...rest } = newUser._doc
            res.status(200).cookie('auth_token', token, { httpOnly: true }).json(rest)
        }
    } catch (error) {

    }
}

// Update user details
export const updateUser = async (req, res, next) => {
    if (req.user.userId !== req.params.id) {
        return next(errorHandler(403, 'You are not allowed to update this user!'))
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Password must be atleast 6 characters!'))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Username must be between 7 and 20 characters!'))
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username cannot contain spaces!'))
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, 'Username must be lowercase!'))
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, 'Username can only contain letters and numbers!'))
        }
    }
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password,
            }
        },
            {
                new: true
            });
        const { password, ...rest } = updateUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error)
    }
}
// Logout
export const logout = (req, res, next) => {
    try {
        res.clearCookie('auth_token').status(200).json('User has been logged out!')
    } catch (error) {
        next(error)
    }
}

// Delete user
export const deleteUser = async (req, res, next) => {
    if (req.user.userId !== req.params.id) {
        return next(errorHandler(403, 'You are not allowed to delete this user!'))
    }
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('User deleted successfully')
    } catch (error) {
        next(error)
    }
}