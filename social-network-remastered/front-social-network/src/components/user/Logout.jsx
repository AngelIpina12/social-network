import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store';

export const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.clear();
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  return (
    <h1>Closing session...</h1>
  )
}
