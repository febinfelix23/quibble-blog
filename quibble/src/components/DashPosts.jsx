import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Modal, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi';

function DashPosts() {

  const { currentUser } = useSelector(state => state.user);
  const [userPosts, setUserPosts] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [openModal, setOpenModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('')

  // Fetch posts function and API
  const fetchPosts = async () => {
    try {
      const result = await fetch(`/qserver/post/getposts?userId=${currentUser._id}`)
      const resultData = await result.json();
      if (result.ok) {
        setUserPosts(resultData.posts)
        if (resultData.posts.length < 9) {
          setShowMore(false);
        }
      }

    } catch (error) {
      console.log(error);
    }
  }

  // Fetch more posts function and API
  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const result = await fetch(`/qserver/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`)
      const resultData = await result.json()

      if (result.ok) {
        setUserPosts((prev) => [...prev, ...resultData.posts])
        if (resultData.posts.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Delete post function and API
  const handleDeletePost = async()=>{
    setOpenModal(false);
    try {
      const result = await fetch(`/qserver/post/delete/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      })
      const resultData = await result.json()
      if(result.ok){
        setUserPosts((prev)=> prev.filter((post)=>post._id !== postIdToDelete));
      }else{
        console.log(resultData.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Use Effects
  useEffect(() => {
    if (currentUser.isAdmin) {
      fetchPosts()
    }
  }, [currentUser._id])

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {
        currentUser.isAdmin && userPosts.length > 0 ? (
          <>
            <Table hoverable className='shadow-md'>
              <Table.Head>
                <Table.HeadCell>Date updated</Table.HeadCell>
                <Table.HeadCell>Post Image</Table.HeadCell>
                <Table.HeadCell>Post Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>
                  <span>Edit</span>
                </Table.HeadCell>
              </Table.Head>

              {userPosts.map((posts, index) => (
                <Table.Body key={index} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>{new Date(posts.updatedAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell><Link to={`/post/${posts.slug}`}><img src={posts.image} alt={posts.title} className='w-40 object-cover bg-gray-500' /></Link></Table.Cell>
                    <Table.Cell><Link className='font-semibold text-gray-900 dark:text-white' to={`/post/${posts.slug}`}>{posts.title}</Link></Table.Cell>
                    <Table.Cell>{posts.category}</Table.Cell>
                    <Table.Cell>
                      <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={() => {setOpenModal(true); setPostIdToDelete(posts._id)}}> Delete</span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link className='text-teal-500' to={`/update-post/${posts._id}`}>
                        <span className='hover:underline cursor-pointer'>Edit</span>
                      </Link>
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
          <p>You have no posts yet.</p>
        )
      }

      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body className='dark:bg-gray-400'>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
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

export default DashPosts