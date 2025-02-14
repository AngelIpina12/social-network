import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import avatar from '../../assets/img/user.png'
import { Global } from '../../helpers/Global';
import { SerializeForm } from '../../helpers/SerializeForm';
import { useUpdateUserMutation, useUploadUserImageMutation } from '../../store/apis/userApi';

export const Config = () => {
    const auth = useSelector((state) => state.auth.user);
    const [updateStatus, setUpdateStatus] = useState("idle");
    const [uploadStatus, setUploadStatus] = useState("idle");
    const fileInputRef = useRef(null);
    const [updateUserMutation] = useUpdateUserMutation();
    const [uploadUserImageMutation] = useUploadUserImageMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateStatus("loading");
        setUploadStatus("idle");
        let newDataUser = SerializeForm(e.target);
        const fileInput = fileInputRef.current;
        delete newDataUser.file0;
        try {
            const response = await updateUserMutation({ userUpdated: newDataUser }).unwrap();
            if (response.status === "success") {
                setUpdateStatus("success");
            } else {
                setUpdateStatus("error");
            }
        } catch (error) {
            setUpdateStatus("error");
        }
        if (fileInput && fileInput.files && fileInput.files[0]) {
            const formData = new FormData();
            formData.append("file0", fileInput.files[0]);
            try {
                const uploadResponse = await uploadUserImageMutation(formData).unwrap();
                if (uploadResponse.status === "success") {
                    setUploadStatus("success");
                } else {
                    setUploadStatus("error");
                }
            } catch (error) {
                setUploadStatus("error");
            }
        }
    }

    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Configuration</h1>
            </header>
            <div className='content__posts'>
                {updateStatus === "success" && (
                    <strong className="alert alert-success">User updated successfully!</strong>
                )}
                {updateStatus === "error" && (
                    <strong className="alert alert-danger">
                        An error has occurred updating user data. Try again.
                    </strong>
                )}
                {uploadStatus === "loading" && <p>Uploading image...</p>}
                {uploadStatus === "success" && <p>Image uploaded successfully!</p>}
                {uploadStatus === "error" && <p>There was an error uploading the image.</p>}
                <form className="config-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your name"
                            defaultValue={auth?.name || ''}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="surname">Surname</label>
                        <input
                            type="text"
                            id="surname"
                            name="surname"
                            placeholder="Enter your surname"
                            defaultValue={auth?.surname || ''}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nick">Nick</label>
                        <input
                            type="text"
                            id="nick"
                            name="nick"
                            placeholder="Enter your nickname"
                            defaultValue={auth?.nick || ''}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            placeholder="Enter your bio"
                            defaultValue={auth?.bio || ''}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            defaultValue={auth?.email || ''}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="Enter your password" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="file0">Avatar</label>
                        <div className="general-info__container-avatar">
                            {auth?.image && auth.image !== "default.jpg" ? (
                                <img
                                    src={Global.url + "user/avatar/" + auth.image}
                                    className="container-avatar__img"
                                    alt="Foto de perfil"
                                />
                            ) : (
                                <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />
                            )}
                        </div>
                        <br />
                        <input type="file" id="file0" name="file0" ref={fileInputRef} />
                    </div>
                    <br />
                    <input type="submit" value="Update" className="btn btn-success" />
                </form>
                <br />
            </div>
        </>
    )
}
