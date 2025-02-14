import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useForm } from '../../hooks/useForm'
import { useLoginUserMutation } from '../../store';

export const Login = () => {
    const { form, changed } = useForm({});
    const auth = useSelector((state) => state.auth);
    const [loginUser, { isLoading, error }] = useLoginUserMutation();

    // Iniciar sesión
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await loginUser({ userLogged: form }).unwrap();
        } catch (err) {
            console.error("Error al iniciar sesión:", err);
        }
    };

    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Login</h1>
            </header>
            <div className='content__posts'>
                {auth.user && (
                    <strong className="alert alert-success">
                        User logged successfully!
                    </strong>
                )}
                {error && (
                    <strong className="alert alert-danger">
                        An error has occurred. Try again.
                    </strong>
                )}
                <form className='form-login' onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor='email'>Email</label>
                        <input type="email" name="email" onChange={changed} />
                    </div>
                    <div className="form-group">
                        <label htmlFor='password'>Password</label>
                        <input type="password" name="password" onChange={changed} />
                    </div>
                    <input type="submit" name='identify' value='Send' className='btn btn-success' />
                </form>
            </div>
        </>
    )
}
