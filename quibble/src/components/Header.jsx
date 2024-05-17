import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'
import { logoutSuccess } from '../redux/user/userSlice'

function Header() {

  const path = useLocation().pathname;
  const { currentUser } = useSelector(state => state.user);
  const { theme } = useSelector(state => state.theme);
  const dispatch = useDispatch();

  // Logout function and API
  const handleLogout = async () => {
    try {
      const result = await fetch('/qserver/user/logout', {
        method: 'POST',
      })
      const resultData = await result.json()
      if (result.status === 200) {
        dispatch(logoutSuccess())
      } else {
        console.log(resultData.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <Navbar className='border-b-2 p-3'>
      <Link to={'/'} className='self-center whitespace-nowrap text-xl sm:text-xl font-extrabold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text'>Quibble</span>
      </Link>

      <form>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
        />
      </form>
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch style={{ marginTop: '3px' }} />
      </Button>

      <div className="flex gap-2 md:order-2">
        <Button className='w-12 h-10 hidden sm:inline me-5' color='gray' onClick={() => dispatch(toggleTheme())}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </Button>

        {
          currentUser ? (
            <Dropdown arrowIcon={false} inline label={<Avatar alt='user' img={currentUser.profilePicture} rounded />}>
              <Dropdown.Header>
                <span className='block text-sm'><span className='font-semibold'>username: </span>{currentUser.username}</span>
                <span className='block text-sm'><span className='font-semibold'>email: </span>{currentUser.email}</span>
              </Dropdown.Header>

              <Link to={'/dashboard?tab=profile'}>
                <Dropdown.Item className='font-semibold'>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item className='font-semibold' onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to='/login'>
              <Button gradientDuoTone='purpleToBlue'>
                Login
              </Button>
            </Link>
          )
        }
        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={'div'}>
          <Link to={'/'} className='font-semibold'>
            Home
          </Link>
        </Navbar.Link>

        <Navbar.Link active={path === '/about'} as={'div'}>
          <Link to={'/about'} className='font-semibold'>
            About
          </Link>
        </Navbar.Link>

        <Navbar.Link active={path === '/projects'} as={'div'}>
          <Link to={'/projects'} className='font-semibold'>
            Projects
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header