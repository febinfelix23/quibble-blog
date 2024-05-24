import { errorHandler } from "../middleware/errorMiddleware.js";
import Comment from "../models/commentModel.js";

// Post a comment
export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body;

        if (userId !== req.user.userId) {
            return next(errorHandler(403, 'You are not allowed to create this comment!'))
        }

        const newComment = new Comment({
            content,
            postId,
            userId,
        });

        await newComment.save()

        res.status(200).json(newComment);

    } catch (error) {
        next(error)
    }
}

// Get all comments
export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({
            createdAt: -1,
        });
        res.status(200).json(comments)
    } catch (error) {
        next(error)
    }
}

// Like a comment
export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404,'Comment not found!'))
        }
        const userIndex = comment.likes.indexOf(req.user.userId);
        if(userIndex === -1){
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.userId);
        }else{
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1);
        }

        await comment.save()
        res.status(200).json(comment)
    } catch (error) {
        next(error)
    }
}

// Delete a comment
export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            next(errorHandler(404, 'Comment not found!'))
        }

        if(comment.userId !== req.user.userId && !req.user.isAdmin){
            next(errorHandler(403, 'You are not allowed to delete this comment!'))
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json('Comment has been deleted!')
    } catch (error) {
        next(error)
    }
}