import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { useCreateUserMutation } from '../../store';

export const Register = () => {
    const { form, changed } = useForm({});
    const [saved, setSaved] = useState("not_sended");
    const [createUser] = useCreateUserMutation();

    // Crear usuario
    const saveUser = async (e) => {
        e.preventDefault();
        try {
            const response = await createUser({ userCreated: form }).unwrap();
            if (response.status === "success") {
                setSaved("saved");
            } else {
                setSaved("error");
            }
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            setSaved("error");
        }
    }

    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Register</h1>
            </header>
            <div className='content__posts'>
                {saved === "saved" && (
                    <strong className="alert alert-success">
                        User registered successfully!
                    </strong>
                )}
                {saved === "error" && (
                    <strong className="alert alert-danger">
                        An error has occurred. Try again.
                    </strong>
                )}
                <form className='register-form' onSubmit={saveUser}>
                    <div className="form-group">
                        <label htmlFor='name'>Name</label>
                        <input type="text" id='name' name="name" onChange={changed} placeholder="Enter your name" />
                    </div>
                    <div className="form-group">
                        <label htmlFor='surname'>Surname</label>
                        <input type="text" id='surname' name="surname" onChange={changed} placeholder="Enter your surname" />
                    </div>
                    <div className="form-group">
                        <label htmlFor='nick'>Nick</label>
                        <input type="text" id='nick' name="nick" onChange={changed} placeholder="Enter your nickname" />
                    </div>
                    <div className="form-group">
                        <label htmlFor='email'>Email</label>
                        <input type="email" id='email' name="email" onChange={changed} placeholder="Enter your email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor='password'>Password</label>
                        <input type="password" id='password' name="password" onChange={changed} placeholder="Enter your password" />
                    </div>
                    <input type="submit" value="Register" className='btn btn-success' />
                </form>
            </div>
        </>
    )
}
