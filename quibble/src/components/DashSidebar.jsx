import React, { useEffect, useState } from 'react'
import { Sidebar } from 'flowbite-react'
import { HiArrowSmRight, HiUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import { logoutSuccess } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'

function DashSidebar() {

    const location = useLocation()
    const [tab, setTab] = useState('')
    const dispatch = useDispatch()

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
                <Sidebar.ItemGroup>
                    <Link to={'/dashboard?tab=profile'}>
                        <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={'User'} labelColor='dark' className='cursor-pointer' as={'div'}>
                            Profile
                        </Sidebar.Item>
                    </Link>

                    <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' as={'div'} onClick={handleLogout}>
                        Logout
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashSidebar