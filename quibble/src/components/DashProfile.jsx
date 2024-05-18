import { Alert, Button, Modal, Spinner, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link } from 'react-router-dom'
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  logoutSuccess
} from '../redux/user/userSlice'
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DashProfile() {

  // Initialization
  const { currentUser, error, loading } = useSelector(state => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileURL, setImageFileURL] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
  const [imageFileUploadError, setImageFileUploadError] = useState(null)
  const [formData, setFormData] = useState({})
  const [imageUploading, setImageUploading] = useState(false)
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch()
  const filePickerRef = useRef()

  // Handle Change in Form
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file);
      setImageFileURL(URL.createObjectURL(file))
    }
  }

  // Upload Profile Image Function using Firebase
  const uploadImage = async () => {
    setImageUploading(true)
    setImageFileUploadError(null)
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          'Could not upload image! File must be less than 2MB'
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileURL(null);
        setImageUploading(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileURL(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL })
        })
        setImageFileUploadProgress(null);
        setImageUploading(false)
      }
    );
  }

  // Handle Change in User detials update form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  // User details update function
  const handleUserDetailsUpdate = async (e) => {
    e.preventDefault();
    setUpdateUserError(null)
    setUpdateUserSuccess(null)
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes were made')
      setTimeout(() => {
        setUpdateUserError(null)
      }, 2000)
      return;
    }
    if (imageUploading) {
      setUpdateUserError('Please wait for image to uploaded')
      return;
    }
    try {
      dispatch(updateStart())
      const result = await fetch(`/qserver/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const resultData = await result.json()

      if (result.status === 200) {
        dispatch(updateSuccess(resultData))
        setUpdateUserSuccess("User details updated successfully!")
        setTimeout(() => {
          setUpdateUserSuccess(null)
        }, 2000)
      } else {
        dispatch(updateFailure(resultData.message))
        setUpdateUserError(resultData.message)
      }
    } catch (error) {
      dispatch(updateFailure(error.message))
    }
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
      } else {
        console.log(resultData.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // Delete user function and API
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      const result = await fetch(`/qserver/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const resultData = await result.json()
      if (result.status === 200) {
        dispatch(deleteUserSuccess(resultData))
      } else {
        dispatch(deleteUserFailure(resultData.message))
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
    setOpenModal(false)
  }

  // Use Effects
  useEffect(() => {
    if (imageFile) {
      uploadImage()
    }
  }, [imageFile])

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-5 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleUserDetailsUpdate}>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
          {
            imageFileUploadProgress && (
              <CircularProgressbar value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  },
                  path: {
                    stroke: `rgba(62, 152, 199)`,
                  }
                }}
              />
            )
          }
          <img src={imageFileURL || currentUser.profilePicture} alt="profile" className={`rounded-full w-full h-full object-cover border-4 border-blue-300 ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`} />
        </div>
        {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}

        <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username} onChange={handleChange} />

        <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} onChange={handleChange} />

        <TextInput type='password' id='password' placeholder='Password' onChange={handleChange} />

        <Button type='submit' gradientDuoTone='purpleToPink' disabled={loading || imageUploading}>
          {loading || imageUploading ?
            <>
              <Spinner size='sm' />
              <span className='pl-3'>Updating....</span>
            </> : 'Update'}
        </Button>

        {
          currentUser.isAdmin && (
            <Link to={'/create-posts'}>
              <Button gradientDuoTone='greenToBlue' className='text-white w-full'  outline>
                Create a post
              </Button>
            </Link>
          )
        }
      </form>

      <div className="flex justify-between text-red-500 mt-5">
        <span className='cursor-pointer' onClick={() => setOpenModal(true)}>Delete account</span>
        <span className='cursor-pointer' onClick={handleLogout}>Sign Out</span>
      </div>

      {
        updateUserSuccess && (
          <Alert color='success' className='mt-5'>
            {updateUserSuccess}
          </Alert>
        )
      }
      {
        updateUserError && (
          <Alert color='failure' className='mt-5'>
            {updateUserError}
          </Alert>
        )
      }
      {
        error && (
          <Alert color='failure' className='mt-5'>
            {error}
          </Alert>
        )
      }

      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body className='dark:bg-gray-400'>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this product?
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

export default DashProfile