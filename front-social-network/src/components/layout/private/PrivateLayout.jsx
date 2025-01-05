import React from 'react'
import { Header } from './Header'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export const PrivateLayout = () => {
    return (
        <>
            {/* LAYOUT */}

            {/* HEADER & NAV */}
            <Header />

            {/* PRINCIPAL CONTENT */}
            <section className='layout__content'>
                <Outlet />
            </section>

            {/* SIDEBAR */}
            <Sidebar></Sidebar>
        </>
    )
}
