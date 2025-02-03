import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export const Logout = () => {
    const {setAuth, setCounter} = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.clear();
        setAuth({});
        setCounter({});
        navigate('/login');
    })

  return (
    <h1>Closing session...</h1>
  )
}
