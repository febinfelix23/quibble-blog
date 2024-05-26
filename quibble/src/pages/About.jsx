import React from 'react'
import { Link } from 'react-router-dom'

function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className="max-w-3xl mx-auto p-3 text-center">
        <div>
          <div>
            <Link to={'/'} className='font-extrabold dark:text-white text-6xl'>
              <span className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text'>Quibble</span>
            </Link>
          </div>
          <h1 className='text-2xl font-semibold my-7'>About</h1>
          <div className="text-md text-gray-500 flex flex-col gap-6">
            <p>
              Welcome to Quibble! This is a personal blog created by <span className='font-bold'>Febin Felix</span> as a personal project on my web development journey.
            </p>
            <p>
              This is just a demo webiste and you are free to explore the demo blogs that are posted in this website. This blog website is created with many features for the users and admins. The website allow users to view and read the blogs, comment on the posts and like the comment of others and even themselves. It also allows the users to change their profile picture, username, email and password. The users should login to comment and like on the posts. Users could register or login by their own username, email and password or using their personal Google id. A theme change feature is also added to the website for users who prefer either Light mode or Dark mode.
            </p>
            <p>
              The technologies used in for creating this website are React and Tailwind CSS. Flowbite ui component library is used to create various functionality components.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About