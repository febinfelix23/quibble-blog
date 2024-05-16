import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { signInSuccess, signInFailure } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

function OAuth() {
    const auth = getAuth(app)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleReg = async () => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            const result = await fetch('/qserver/user/google', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    profileImgURL: resultsFromGoogle.user.photoURL,
                }),
            })
            const resultData = await result.json()
            console.log(resultData);
            if (result.status === 200) {
                dispatch(signInSuccess(resultData))
                navigate('/')
            }

        } catch (error) {
            dispatch(signInFailure(error.message))
        }
    }
    return (
        <Button className='font-semibold' type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleReg}>
            <AiFillGoogleCircle className='w-5 h-5 mr-2' />
            Continue with Google
        </Button>
    )
}

export default OAuth