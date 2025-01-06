import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';
import { SerializeForm } from '../../helpers/SerializeForm';

export const Config = () => {
    const { auth } = useAuth();
    const [saved, setSaved] = useState("not_saved");
    const updateUser = (e) => {
        e.preventDefault();
        let newDataUser = SerializeForm(e.target);
        delete newDataUser.file0;
    }

    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Configuration</h1>
            </header>
            <div className='content__posts'>
                {saved == "saved" ? <strong className='alert alert-success'>User registered successfully!</strong> : ""}
                {saved == "error" ? <strong className='alert alert-danger'>An error has ocurred. Try again.</strong> : ""}
                <form className='config-form' onSubmit={updateUser}>
                    <div className="form-group">
                        <label htmlFor='name'>Name</label>
                        <input type="text" id='name' name="name" placeholder="Enter your name" defaultValue={auth.name} />
                    </div>
                    <div className="form-group">
                        <label htmlFor='surname'>Surname</label>
                        <input type="text" id='surname' name="surname" placeholder="Enter your surname" defaultValue={auth.surname} />
                    </div>
                    <div className="form-group">
                        <label htmlFor='nick'>Nick</label>
                        <input type="text" id='nick' name="nick" placeholder="Enter your nickname" defaultValue={auth.nick} />
                    </div>
                    <div className="form-group">
                        <label htmlFor='bio'>Bio</label>
                        <textarea id='bio' name="bio" placeholder="Enter your bio" defaultValue={auth.bio} />
                    </div>
                    <div className="form-group">
                        <label htmlFor='email'>Email</label>
                        <input type="email" id='email' name="email" placeholder="Enter your email" defaultValue={auth.email} />
                    </div>
                    <div className="form-group">
                        <label htmlFor='password'>Password</label>
                        <input type="password" id='password' name="password" placeholder="Enter your password" />
                    </div>
                    <div className="form-group">
                        <label htmlFor='file0'>Avatar</label>
                        <div className="general-info__container-avatar">
                            {auth.image != "default.png" && <img src={Global.url + "user/avatar/" + auth.image} className="container-avatar__img" alt="Foto de perfil" />}
                            {auth.image == "default.png" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}
                        </div>
                        <br/>
                        <input type="file" id='file0' name="file0"/>
                    </div>
                    <br />
                    <input type="submit" value="Register" className='btn btn-success' />
                </form>
            </div>
        </>
    )
}
