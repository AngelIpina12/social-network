import React from 'react'

export const Register = () => {
    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Register</h1>
            </header>
            <div className='content__posts'>
                <form className='register-form'>
                    <div className="form-group">
                        <label htmlFor='name'>Name</label>
                        <input type="text" id='name' name="name" placeholder="Enter your name"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor='surname'>Surname</label>
                        <input type="text" id='surname' name="surname" placeholder="Enter your surname"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor='nick'>Nick</label>
                        <input type="text" id='nick' name="nick" placeholder="Enter your nickname"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor='email'>Email</label>
                        <input type="email" id='email' name="email" placeholder="Enter your email"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor='password'>Password</label>
                        <input type="password" id='password' name="password" placeholder="Enter your password"/>
                    </div>
                    <input type="submit" value="Register" className='btn btn-success'/>
                </form>
            </div>
        </>
    )
}
