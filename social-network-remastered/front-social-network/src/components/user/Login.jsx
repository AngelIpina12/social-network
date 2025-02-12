import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import useAuth from '../../hooks/useAuth';
import { useLoginUserMutation } from '../../store';

export const Login = () => {
    const { form, changed } = useForm({});
    const [logged, setLogged] = useState("not_logged");
    const { setAuth } = useAuth();
    const [loginUser] = useLoginUserMutation();

    // Iniciar sesión
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({ userLogged: form }).unwrap();
            if (response.status === "success") {
                localStorage.setItem("token", response.token);
                localStorage.setItem("user", JSON.stringify(response.user));
                setLogged("logged");
                setAuth(response.user);
                window.location.reload();
            } else {
                setLogged("error");
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setLogged("error");
        }
    };

    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Login</h1>
            </header>
            <div className='content__posts'>
                {logged === "logged" && (
                    <strong className='alert alert-success'>
                        User logged successfully!
                    </strong>
                )}
                {logged === "error" && (
                    <strong className='alert alert-danger'>
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
