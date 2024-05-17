import { Button, TextInput } from 'flowbite-react'
import React from 'react'
import { useSelector } from 'react-redux'

function DashProfile() {

  const { currentUser } = useSelector(state => state.user)
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-5 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img src={currentUser.profilePicture} alt="profile" className='rounded-full w-full h-full object-cover border-4 border-blue-300' />
        </div>

        <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username}/>

        <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email}/>

        <TextInput type='password' id='password' placeholder='Password'/>

        <Button type='submit' gradientDuoTone='purpleToPink'>
          Update
        </Button>
      </form>

      <div className="flex justify-between text-red-500 mt-5">
        <span>Delete account</span>
        <span>Sign Out</span>
      </div>
    </div>
  )
}

export default DashProfile