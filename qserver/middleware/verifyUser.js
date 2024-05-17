import jwt from 'jsonwebtoken'
import { errorHandler } from './errorMiddleware.js'

export const verifyToken = (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) {
        return next(errorHandler(401, 'Unauthorized!'))
    }
    else {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return next(errorHandler(401, 'Unauthorized!'))
            }
            req.user = user;
            next();
        })
    }
}