import React, { useState } from 'react'
import avatar from '../../../assets/img/user.png'
import { Global } from '../../../helpers/Global';
import { useSelector } from 'react-redux';
import { NavLink, Link, useParams } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';
import {
    useCreatePublicationMutation,
    useUploadPublicationImageMutation,
} from '../../../store';

export const Sidebar = () => {
    const auth = useSelector((state) => state.authData.user);
    const counters = useSelector((state) => state.countersData[auth._id]) || { following: 0, followed: 0, publications: 0 }; 
    console.log(counters)
    const { form, changed } = useForm({});
    const [stored, setStored] = useState("not_stored");
    const [createPublication] = useCreatePublicationMutation();
    const [uploadPublicationImage] = useUploadPublicationImageMutation();

    const savePublication = async (e) => {
        e.preventDefault();
        const newPublication = { ...form, user: auth?._id };
        try {
            const createPublicationResult = await createPublication({ newPublication }).unwrap();
            if (createPublicationResult.status === "success") {
                const fileInput = document.querySelector("#file");
                if (fileInput && fileInput.files && fileInput.files[0]) {
                    const formData = new FormData();
                    formData.append("file0", fileInput.files[0]);
                    const uploadImageResult = await uploadPublicationImage({
                        publicationId: createPublicationResult.publication._id,
                        publication: formData
                    }).unwrap();
                    if (uploadImageResult.status === "success") {
                        setStored("stored");
                    } else {
                        setStored("error");
                    }
                } else {
                    setStored("stored");
                }
            } else {
                setStored("error");
            }
            const myForm = document.querySelector("#publication-form");
            if (myForm) myForm.reset();
        } catch (err) {
            console.error("Error al crear publicación:", err);
            setStored("error");
        }
    }

    return (
        <aside className="layout__aside">

            <header className="aside__header">
                <h1 className="aside__title">Hi, {auth?.name}</h1>
            </header>

            <div className="aside__container">

                <div className="aside__profile-info">

                    <div className="profile-info__general-info">
                        <div className="general-info__container-avatar">
                            {auth?.image != "default.jpg" && <img src={Global.url + "user/avatar/" + auth?.image} className="container-avatar__img" alt="Foto de perfil" />}
                            {auth?.image == "default.jpg" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}
                        </div>

                        <div className="general-info__container-names">
                            <NavLink to={"/social/profile/" + auth?._id} className="container-names__name">{auth?.name} {auth?.surname}</NavLink>
                            <p className="container-names__nickname">{auth?.nick}</p>
                        </div>
                    </div>

                    <div className="profile-info__stats">

                        <div className="stats__following">
                            <Link to={"following/" + auth?._id} className="following__link">
                                <span className="following__title">Followings</span>
                                <span className="following__number">{counters.following}</span>
                            </Link>
                        </div>
                        <div className="stats__following">
                            <Link to={"followers/" + auth?._id} className="following__link">
                                <span className="following__title">Followers</span>
                                <span className="following__number">{counters.followed}</span>
                            </Link>
                        </div>


                        <div className="stats__following">
                            <Link to={"/social/profile/" + auth?._id} className="following__link">
                                <span className="following__title">Publications</span>
                                <span className="following__number">{counters.publications}</span>
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
                            <label htmlFor="image" className="form-post__label">Upload your photo</label>
                            <input type="file" name="file0" id="file" className="form-post__image" />
                        </div>

                        <input type="submit" value="Send" className="form-post__btn-submit" />

                    </form>

                </div>

            </div>

        </aside>
    )
}
