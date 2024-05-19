import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Modal, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';

function DashUsers() {

    const { currentUser } = useSelector(state => state.user);
    const [users, setUsers] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [openModal, setOpenModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('')

    // Fetch users function and API
    const fetchUsers = async () => {
        try {
            const result = await fetch(`/qserver/user/getusers`)
            const resultData = await result.json();
            if (result.ok) {
                setUsers(resultData.users)
                if (resultData.users.length < 9) {
                    setShowMore(false);
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    // Fetch more users function and API
    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const result = await fetch(`/qserver/user/getusers?startIndex=${startIndex}`)
            const resultData = await result.json()

            if (result.ok) {
                setUsers((prev) => [...prev, ...resultData.users])
                if (resultData.users.length < 9) {
                    setShowMore(false)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Delete user function and API
    const handleDeleteUser = async () => {
        try {
            const result = await fetch(`/qserver/user/delete/${userIdToDelete}`, {
                method: 'DELETE',
            })
            const resultData = await result.json()
            if (result.ok) {
                setUsers((prev) => prev.filter((post) => post._id !== userIdToDelete));
                setOpenModal(false)
            } else {
                console.log(resultData.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Use Effects
    useEffect(() => {
        if (currentUser.isAdmin) {
            fetchUsers()
        }
    }, [currentUser._id])

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {
                currentUser.isAdmin && users.length > 0 ? (
                    <>
                        <Table hoverable className='shadow-md'>
                            <Table.Head>
                                <Table.HeadCell>Date created</Table.HeadCell>
                                <Table.HeadCell>User Image</Table.HeadCell>
                                <Table.HeadCell>Username</Table.HeadCell>
                                <Table.HeadCell>Email</Table.HeadCell>
                                <Table.HeadCell>Admin</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                            </Table.Head>

                            {users.map((user, index) => (
                                <Table.Body key={index} className='divide-y'>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                        <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                                        <Table.Cell><img src={user.profilePicture} alt={user.username} className='w-20 h-20 object-cover bg-gray-500 rounded-full' /></Table.Cell>
                                        <Table.Cell>{user.username}</Table.Cell>
                                        <Table.Cell>{user.email}</Table.Cell>
                                        <Table.Cell>{user.isAdmin ? (<FaCheck className='text-green-500' />) : (<FaTimes className='text-red-500' />)}</Table.Cell>
                                        <Table.Cell>
                                            <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={() => { setOpenModal(true); setUserIdToDelete(user._id) }}> Delete</span>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                        </Table>

                        {
                            showMore && (
                                <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>Show More</button>
                            )
                        }
                    </>
                ) : (
                    <p>You have no users yet.</p>
                )
            }

            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body className='dark:bg-gray-400'>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this user?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDeleteUser}>
                                {"Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={() => setOpenModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DashUsers