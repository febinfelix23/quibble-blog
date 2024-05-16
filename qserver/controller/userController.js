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
    const {email, password} = req.body

    if (!email || !password) {
        next(errorHandler(400, 'Please fill the empty fields'))
    }
    else {
        try {
            const validUser = await User.findOne({email})
            if(!validUser || !bcryptjs.compareSync(password, validUser.password)){
                return next(errorHandler(403, 'Invalid username/password'))
            }
            
            const token = jwt.sign({userId:validUser._id}, process.env.JWT_SECRET)
            const {password:pass,...rest} = validUser._doc
            res.status(200).cookie('auth_token', token, {httpOnly: true}).json(rest)

        } catch (error) {
            next(error)
        }
    }
}

