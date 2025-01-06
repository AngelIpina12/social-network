import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global'

export const Register = () => {
    const { form, changed } = useForm({});
    const [ saved, setSaved ] = useState("not_sended")
    const saveUser = async (e) => {
        e.preventDefault();
        let newUser = form;
        const request = await fetch(Global.url + "user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        });
        const data = await request.json();
        if(data.status == "success"){
            setSaved("saved");
        }else{
            setSaved("error");
        }
    }


    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Register</h1>
            </header>
            <div className='content__posts'>
                {saved == "saved" ? <strong className='alert alert-success'>User registered successfully!</strong> : ""}
                {saved == "error" ? <strong className='alert alert-danger'>An error has ocurred. Try again.</strong> : ""}
                <form className='register-form' onSubmit={saveUser}>
                    <div className="form-group">
                        <label htmlFor='name'>Name</label>
                        <input type="text" id='name' name="name" onChange={changed} placeholder="Enter your name"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor='surname'>Surname</label>
                        <input type="text" id='surname' name="surname" onChange={changed} placeholder="Enter your surname"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor='nick'>Nick</label>
                        <input type="text" id='nick' name="nick" onChange={changed} placeholder="Enter your nickname"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor='email'>Email</label>
                        <input type="email" id='email' name="email" onChange={changed} placeholder="Enter your email"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor='password'>Password</label>
                        <input type="password" id='password' name="password" onChange={changed} placeholder="Enter your password"/>
                    </div>
                    <input type="submit" value="Register" className='btn btn-success'/>
                </form>
            </div>
        </>
    )
}
