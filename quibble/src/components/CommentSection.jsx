import { Alert, Button, Textarea } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Comment from './Comment'

function CommentSection({ postId }) {

  const { currentUser } = useSelector(state => state.user)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [commentError, setCommentError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const result = await fetch('/qserver/post/comment', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment, postId, userId: currentUser._id })
      })
      const resultDate = await result.json();
      if (result.ok) {
        setComment('');
        setCommentError(null)
        setComments([resultDate, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message)
    }
  }

  useEffect(() => {
    const getComments = async () => {
      try {
        const result = await fetch(`/qserver/getComment/${postId}`);
        if (result.ok) {
          const resultData = await result.json();
          setComments(resultData)
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    getComments()
  }, [postId])

  const handleLike = async (commentId) => {
    try {
      if(!currentUser){
        navigate('/register');
        return
      }
      const result = await fetch(`/qserver/comment/likeComment/${commentId}`, {
        method: 'PUT',
      });
      if(result.ok){
        const resultData = await result.json();
        setComments(comments.map((comment) =>
          comment._id === commentId? {
            ...comment,
            likes: resultData.likes,
            numberOfLikes: resultData.likes.length,
          } : comment
        ))
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {
        currentUser ? (
          <div className='flex items-center gap-2 my-5 text-gray-500 text-sm'>
            <p>Signed in as:</p>
            <img className='h-8 w-8 rounded-full object-cover' src={currentUser.profilePicture} alt="profile" />
            <Link to={'/dashboard?tab=profile'} className='text-cyan-600 hover:underline'>
              @{currentUser.username}
            </Link>
          </div>
        ) : (
          <div className='flex items-center gap-1 text-sm text-cyan-600 my-5'>
            <p>You must be signed in to comment.</p>
            <Link to={'/login'} className='text-blue-500 hover:underline'>
              Login
            </Link>
          </div>
        )
      }

      {
        currentUser &&
        (<form className='border border-teal-500 rounded-md p-3' onSubmit={handleSubmit}>
          <Textarea placeholder='Add a comment...' rows='3' maxLength='200' onChange={(e) => setComment(e.target.value)} value={comment} />
          <div className="flex justify-between items-center mt-5">
            <p className='text-xs text-gray-500'>{200 - comment.length} characters remaining</p>
            <Button outline gradientDuoTone='purpleToBlue' type='submit'>
              Submit
            </Button>
          </div>

          {
            commentError &&
            <Alert color={'failure'} className='mt-5'>{commentError}</Alert>
          }
        </form>)
      }

      {
        comments.length === 0 ? (
          <p className='text-sm my-5'>
            No comments yet.
          </p>
        ) : (
          <>
            <div className="text-sm my-5 flex items-center gap-1">
              <p>Comments</p>
              <div className="border border-gray-400 px-2 rounded-sm">
                <p>{comments.length}</p>
              </div>
            </div>

            {
              comments.map((comment) => (
                <Comment key={comment._id} comment={comment} onLike={handleLike} />
              ))
            }
          </>
        )
      }
    </div>
  )
}

export default CommentSection