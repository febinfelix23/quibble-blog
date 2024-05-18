import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

function AdminPrivateRoute() {
    const { currentUser } = useSelector(state => state.user);
    return currentUser && currentUser.isAdmin ? <Outlet /> : <Navigate to={'/login'} />
}

export default AdminPrivateRoute