import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';

function Register() {

  const [formData, setFormData] = useState({
    username: "", email: "", password: "",
  });
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      return setErrorMessage('Please fill the empty fields');
    }
    else {
      try {
        setLoading(true)
        setErrorMessage(null)
        const result = await fetch('/qserver/user/register', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const resultData = await result.json();
        console.log(resultData);
        if (result.status === 200) {
          setFormData({
            username: "", email: "", password: "",
          })
          setTimeout(() => {
            setLoading(false)
            navigate('/login')
          }, 2000)
        }
        else {
          setFormData({
            username: "", email: "", password: "",
          })
          setLoading(false);
          return setErrorMessage('User already exist!Please Login');
        }
      } catch (error) {
        setErrorMessage(error.message);
        setLoading(false);
      }
    }
  }

  return (
    <div className='min-h-screen mt-20'>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Leftside */}
        <div className="flex-1">
          <Link to={'/'} className='font-extrabold dark:text-white text-5xl'>
            <span className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text'>Quibble</span>
          </Link>
          <p className='text-sm mt-5 font-medium'>
            This is a demo project. You can register with your email and password or with Google.
          </p>
        </div>

        {/* Rightside */}
        <div className="flex-1">
          <form className='flex flex-col gap-4' onSubmit={handleRegister}>
            <div className="">
              <Label value='Your username' className='font-semibold' />
              <TextInput type='text' placeholder='Username' id='username' onChange={e => setFormData({ ...formData, username: e.target.value })} value={formData.username} />
            </div>
            <div className="">
              <Label value='Your email' className='font-semibold' />
              <TextInput type='email' placeholder='Email' id='email' onChange={e => setFormData({ ...formData, email: e.target.value })} value={formData.email} />
            </div>
            <div className="">
              <Label value='Your password' className='font-semibold' />
              <TextInput type='password' placeholder='Password' id='password' onChange={e => setFormData({ ...formData, password: e.target.value })} value={formData.password} />
            </div>

            <Button gradientDuoTone='purpleToPink' type='submit' className='font-semibold' disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size='sm' />
                    <span className='pl-3'>Loading....</span>
                  </>
                ) : 'Register'
              }
            </Button>

            <OAuth/>
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Already have an account?</span>
            <Link to={'/login'} className='text-blue-500'>Login</Link>
          </div>

          {
            errorMessage && (
              <Alert className='mt-5 font-semibold' color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Register