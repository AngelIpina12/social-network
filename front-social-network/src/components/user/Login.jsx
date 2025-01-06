import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';

export const Login = () => {
    const { form, changed } = useForm({});
    const [ logged, setLogged ] = useState("not_logged");
    const {setAuth} = useAuth();
    const loginUser = async (e) => {
        e.preventDefault();
        let userToLogin = form;
        const response = await fetch(Global.url + 'user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userToLogin),
        });
        const data = await response.json();
        if(data.status == "success"){
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setLogged("logged");
            setAuth(data.user);
            window.location.reload();
        }else{
            setLogged("error");
        }
    }

    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Login</h1>
            </header>
            <div className='content__posts'>
                {logged == "logged" ? <strong className='alert alert-success'>User logged successfully!</strong> : ""}
                {logged == "error" ? <strong className='alert alert-danger'>An error has ocurred. Try again.</strong> : ""}
                <form className='form-login' onSubmit={loginUser}>
                    <div className="form-group">
                        <label htmlFor='email'>Email</label>
                        <input type="email" name="email" onChange={changed}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor='password'>Password</label>
                        <input type="password" name="password" onChange={changed}/>
                    </div>
                    <input type="submit" name='identify' value='Send' className='btn btn-success' />
                </form>
            </div>
        </>
    )
}
