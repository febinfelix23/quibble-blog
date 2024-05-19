import { Button, Spinner } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

function PostPage() {

    const { postSlug } = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [post, setPost] = useState(null)

    const fetchPost = async () => {
        try {
            setLoading(true);
            const result = await fetch(`/qserver/post/getposts?slug=${postSlug}`);
            const resultData = await result.json();
            if (result.ok) {
                setPost(resultData.posts[0])
                setLoading(false)
                setError(false)
            } else {
                setError(true)
                setLoading(false)
                return
            }
        } catch (error) {
            setError(true)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPost()
    }, [postSlug])

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Spinner size={'xl'} />
        </div>
    )
    return (
        <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
            <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>

            <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
            <Button color={'gray'} pill size={'xs'}>
                {post && post.category}
            </Button>
            </Link>

            <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 max-h-[600] w-full object-cover' />

            <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
            </div>

            <div className='p-2 max-w-5xl mx-auto w-full mt-5 post-content' dangerouslySetInnerHTML={{__html: post && post.content}}></div>
        </main>
    )
}

export default PostPage