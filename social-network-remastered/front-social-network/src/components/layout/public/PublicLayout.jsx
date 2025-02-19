import React from 'react'
import { Header } from './Header'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export const PublicLayout = () => {
  const auth = useSelector((state) => state.authData.user);

  return (
    <>
        {/* LAYOUT */}
        <Header/>

        {/* PRINCIPAL CONTENT */}
        <section className='layout__content'>
          {!auth?._id ? <Outlet/> : <Navigate to="/social"/> }
        </section>
    </>
  )
}
