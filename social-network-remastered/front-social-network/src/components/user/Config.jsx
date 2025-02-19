import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import avatar from '../../assets/img/user.png'
import { Global } from '../../helpers/Global';
import { SerializeForm } from '../../helpers/SerializeForm';
import { useUpdateUserMutation, useUploadUserImageMutation } from '../../store/apis/userApi';

export const Config = () => {
    const auth = useSelector((state) => state.authData.user);
    const fileInputRef = useRef(null);
    const [
        updateUserMutation,
        {
            isLoading: isUpdating,
            isError: updateError,
            error: updateErrorObj,
            isSuccess: updateSuccess 
        }
    ] = useUpdateUserMutation();
    const [
        uploadUserImageMutation,
        {
            isLoading: isUploading,
            isError: uploadError,
            error: uploadErrorObj,
            isSuccess: uploadSuccess 
        }
    ] = useUploadUserImageMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newDataUser = SerializeForm(e.target);
        const fileInput = fileInputRef.current;
        delete newDataUser.file0;
        try {
            await updateUserMutation({ userUpdated: newDataUser }).unwrap();
        } catch (error) {
            console.error("Error updating user:", error);
        }
        if (fileInput && fileInput.files && fileInput.files[0]) {
            const formData = new FormData();
            formData.append("file0", fileInput.files[0]);
            try {
                await uploadUserImageMutation(formData).unwrap();
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
    }

    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Configuration</h1>
            </header>
            <div className='content__posts'>
                {updateSuccess && <strong className="alert alert-success">User updated successfully!</strong>}
                {updateError && (
                    <strong className="alert alert-danger">
                        Error updating user: {updateErrorObj?.data?.message || updateErrorObj.error}
                    </strong>
                )}
                {isUpdating && <strong className="alert alert-warning">Updating user data...</strong>}

                {uploadSuccess && <strong className="alert alert-success">Image uploaded successfully!</strong>}
                {uploadError && (
                    <strong className="alert alert-danger">Error uploading image: {uploadErrorObj?.data?.message || uploadErrorObj.error}</strong>
                )}
                {isUploading && <strong className="alert alert-warning">Uploading image...</strong>}
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
                                    src={Global.url + "user/avatar/" + auth?.image}
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
