import React from 'react'
import { Header } from './Header'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Nav } from './Nav'

export const PublicLayout = () => {
  const auth = useSelector((state) => state.authData.user);

  return (
    <>
      {/* LAYOUT */}
      {/* <Header/> */}
      <Nav />

      {/* PRINCIPAL CONTENT */}
      <section className='layout__content'>
        {!auth?._id ? <Outlet /> : <Navigate to="/social" />}
      </section>
    </>
  )
}
