import React, { useState } from 'react'
import avatar from '../../../assets/img/user.png'
import useAuth from '../../../hooks/useAuth'
import { Global } from '../../../helpers/Global';
import { NavLink, Link } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';

export const Sidebar = () => {
    const { auth, counter } = useAuth();
    const { form, changed } = useForm({});
    const [stored, setStored] = useState("not_stored");

    const savePublication = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token")
        let newPublication = form;
        newPublication.user = auth._id;
        const response = await fetch(`${Global.url}publication/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(newPublication)
        });
        const data = await response.json();
        if (data.status === "success") {
            setStored("stored")
        } else {
            setStored("error");
        }
        const fileInput = document.querySelector("#file");
        if (data.status === "success" && fileInput.files[0]) {
            console.log(data)
            const formData = new FormData();
            formData.append("file0", fileInput.files[0]);
            const uploadRequest = await fetch(`${Global.url}publication/upload/${data.publication._id}`, {
                method: 'POST',
                headers: {
                    "Authorization": token
                },
                body: formData
            });
            const uploadData = await uploadRequest.json();
            if (uploadData.status === "success") {
                setStored("stored");
            } else {
                setStored("error");
            }
            if(data.status === "success" && uploadData.status === "success"){
                const myForm = document.querySelector("#publication-form");
                myForm.reset();
            }
        }
    }

    return (
        <aside className="layout__aside">

            <header className="aside__header">
                <h1 className="aside__title">Hi, {auth.name}</h1>
            </header>

            <div className="aside__container">

                <div className="aside__profile-info">

                    <div className="profile-info__general-info">
                        <div className="general-info__container-avatar">
                            {auth.image != "default.jpg" && <img src={Global.url + "user/avatar/" + auth.image} className="container-avatar__img" alt="Foto de perfil" />}
                            {auth.image == "default.jpg" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}
                        </div>

                        <div className="general-info__container-names">
                            <NavLink to={"/social/profile/" + auth._id} className="container-names__name">{auth.name} {auth.surname}</NavLink>
                            <p className="container-names__nickname">{auth.nick}</p>
                        </div>
                    </div>

                    <div className="profile-info__stats">

                        <div className="stats__following">
                            <Link to={"following/" + auth._id} className="following__link">
                                <span className="following__title">Followings</span>
                                <span className="following__number">{counter.following}</span>
                            </Link>
                        </div>
                        <div className="stats__following">
                            <Link to={"followers/" + auth._id} className="following__link">
                                <span className="following__title">Followers</span>
                                <span className="following__number">{counter.followed}</span>
                            </Link>
                        </div>


                        <div className="stats__following">
                            <Link to={"/social/profile/" + auth._id} className="following__link">
                                <span className="following__title">Publications</span>
                                <span className="following__number">{counter.publications}</span>
                            </Link>
                        </div>


                    </div>
                </div>


                <div className="aside__container-form">
                    {stored === "stored" ? <strong className='alert alert-success'>Publication has been posted successfully!</strong> : ""}
                    {stored === "error" ? <strong className='alert alert-danger'>An error has ocurred. Try again.</strong> : ""}
                    <form id='publication-form' className="container-form__form-post" onSubmit={savePublication}>

                        <div className="form-post__inputs">
                            <label htmlFor="text" className="form-post__label">What are you thinking today?</label>
                            <textarea name="text" className="form-post__textarea" onChange={changed}></textarea>
                        </div>

                        <div className="form-post__inputs">
                            <label htmlFor="image" className="form-post__label">Sube tu foto</label>
                            <input type="file" name="file0" id="file" className="form-post__image" />
                        </div>

                        <input type="submit" value="Enviar" className="form-post__btn-submit" />

                    </form>

                </div>

            </div>

        </aside>
    )
}
