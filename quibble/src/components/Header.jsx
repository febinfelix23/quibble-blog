import { Avatar, Button, Dropdown, Modal, Navbar, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'
import { logoutSuccess } from '../redux/user/userSlice'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

function Header() {

  const path = useLocation().pathname;
  const location = useLocation();
  const { currentUser } = useSelector(state => state.user);
  const { theme } = useSelector(state => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  // Search Function
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search])

  // Handle Sumbit Function
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)
  }

  // Logout function and API
  const handleLogout = async () => {
    try {
      const result = await fetch('/qserver/user/logout', {
        method: 'POST',
      })
      const resultData = await result.json()
      if (result.status === 200) {
        dispatch(logoutSuccess())
        setOpenModal(false)
      } else {
        console.log(resultData.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <Navbar className='border-b-2 p-3 sticky top-0' style={{ zIndex: 1 }}>
      <Link to={'/'} className='self-center whitespace-nowrap text-xl sm:text-xl font-extrabold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text'>Quibble</span>
      </Link>

      <form onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
              <Dropdown.Item className='font-semibold' onClick={() => setOpenModal(true)}>Logout</Dropdown.Item>
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
      </Navbar.Collapse>

      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body className='dark:bg-gray-400'>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to logout from this account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleLogout}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Navbar>
  )
}

export default Header