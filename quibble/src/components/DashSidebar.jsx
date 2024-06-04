import React, { useEffect, useState } from 'react'
import { Button, Modal, Sidebar } from 'flowbite-react'
import { HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineExclamationCircle, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import { logoutSuccess } from '../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'

function DashSidebar() {

    const { currentUser } = useSelector(state => state.user)
    const location = useLocation()
    const [tab, setTab] = useState('')
    const dispatch = useDispatch()
    const [openModal, setOpenModal] = useState(false);

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

    // UseEffects
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl)
        }
    }, [location.search])

    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    <Link to={'/dashboard?tab=profile'}>
                        <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark' className='cursor-pointer' as={'div'}>
                            Profile
                        </Sidebar.Item>
                    </Link>

                    {currentUser.isAdmin && (
                        <Link to={'/dashboard?tab=posts'}>
                            <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} className='cursor-pointer' as={'div'}>
                                Posts
                            </Sidebar.Item>
                        </Link>
                    )}

                    {currentUser.isAdmin && (
                        <Link to={'/dashboard?tab=users'}>
                            <Sidebar.Item active={tab === 'users'} icon={HiOutlineUserGroup} className='cursor-pointer' as={'div'}>
                                Users
                            </Sidebar.Item>
                        </Link>
                    )}

                    {currentUser.isAdmin && (
                        <Link to={'/dashboard?tab=overview'}>
                            <Sidebar.Item active={tab === 'overview'} icon={HiChartPie} className='cursor-pointer' as={'div'}>
                                Overview
                            </Sidebar.Item>
                        </Link>
                    )}

                    <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' as={'div'} onClick={() => setOpenModal(true)}>
                        Logout
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>

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
        </Sidebar>
    )
}

export default DashSidebar