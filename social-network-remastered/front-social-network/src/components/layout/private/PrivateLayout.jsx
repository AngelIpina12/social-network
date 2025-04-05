import React from 'react'
import { Header } from './Header'
import { Navigate, Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useSelector } from 'react-redux'
import { Nav } from './Nav'

export const PrivateLayout = () => {
    const { user, loading } = useSelector((state) => state.authData);
    if (loading) {
        return <h1>Loading...</h1>
    } else {
        return (
            <>
                {/* LAYOUT */}

                {/* HEADER & NAV */}
                {/* <Header /> */}
                <Nav />

                {/* PRINCIPAL CONTENT */}
                <section className='layout__content'>
                    {user?._id ? <Outlet /> : <Navigate to="/login" />}
                </section>

                {/* SIDEBAR */}
                <Sidebar></Sidebar>
            </>
        )
    }
}
