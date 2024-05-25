import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PostCard from '../components/PostCard'

function Home() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await fetch('/qserver/post/getposts')
        const resultData = await result.json();
        if (result.ok) {
          setPosts(resultData.posts)
          // if (resultData.posts.length < 9) {
          //   setShowMore(false);
          // }
        }

      } catch (error) {
        console.log(error);
      }
    }

    fetchPosts()
  }, [])

  return (
    <div>
      <div className="flex flex-col gap-6 lg:p-28 p-5 max-w-6xl mx-auto">
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to Quibble</h1>
        <p className='text-gray-500 text-md sm:text-sm'>
          This is a personal blogging app that was created as a project for my web-development journey.Feel free to explore the blog and view demo articles that are available in the website.
        </p>

        <Link to={'/search'} className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'>
          View all posts
        </Link>
      </div>

      <div className="mx-auto p-3 flex flex-col gap-8 py-7">
        {
          posts && posts.length > 0 && (
            <div className="flex flex-col gap-6">
              <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
              <div className="flex flex-wrap gap-4 justify-center mt-5">
                {
                  posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))
                }
              </div>
              <div className='text-center'>
                <Link to={'/search'} className='text-sm sm:text-lg text-teal-500 font-bold hover:underline'>
                  View all posts
                </Link>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Home