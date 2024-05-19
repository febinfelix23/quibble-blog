import { errorHandler } from "../middleware/errorMiddleware.js";
import Comment from "../models/commentModel.js";

export const createComment = async (req, res, next)=>{
    try {
        const { content, postId, userId} = req.body;

        if(userId !== req.user.userId) {
            return next(errorHandler(403, 'You are not allowed to create this comment!'))
        }

        const newComment = new Comment({
            content,
            postId,
            userId
        })

        await newComment.save();

        res.status(200).json(newComment);
        
    } catch (error) {
        next(error)
    }
}