import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import avatar from '../../assets/img/user.png'
import { Global } from '../../helpers/Global';
import { setCurrentPage } from '../../store/slices/userSlice';
import {
    useCreateUserFollowMutation,
    useDeleteUserFollowMutation,
    addFollowing,
    removeFollowing
} from '../../store';

export const UserList = ({ users, getUsers, currentPage, loading, more,  }) => {
    const { auth } = useAuth();
    const dispatch = useDispatch();
    const followings = useSelector((state) => state.followData.followings.data)
    const [createUserFollow] = useCreateUserFollowMutation();
    const [deleteUserFollow] = useDeleteUserFollowMutation();

    const nextPage = () => {
        dispatch(setCurrentPage(currentPage + 1));
      };

    const follow = async (id) => {
        try {
            const response = await createUserFollow({ userId: id }).unwrap();
            if (response.status === "success") {
                const followInfo = {
                    _id: response.follow.followed,
                    created_at: response.follow.created_at
                };
                dispatch(addFollowing(followInfo));
            }
        } catch (error) {
            console.error("Error al seguir usuario:", error);
        }
    };

    const unfollow = async (id) => {
        try {
            const response = await deleteUserFollow({ userId: id }).unwrap();
            if (response.status === "success") {
                dispatch(removeFollowing(id));
            }
        } catch (error) {
            console.error("Error al dejar de seguir:", error);
        }
    };

    return (
        <>
            <div className="content__posts">

                {users.map(user => {
                    return (
                        <article className="posts__post" key={user._id}>

                            <div className="post__container">

                                <div className="post__image-user">
                                    <Link to={"/social/profile/" + user._id} className="post__image-link">
                                        {user.image !== "default.jpg" ? (
                                            <img src={Global.url + "user/avatar/" + user.image} className="post__user-image" alt="Foto de perfil" />
                                        ) : (
                                            <img src={avatar} className="post__user-image" alt="Foto de perfil" />
                                        )}
                                    </Link>
                                </div>

                                <div className="post__body">

                                    <div className="post__user-info">
                                        <Link to={"/social/profile/" + user._id} className="user-info__name">{user.name} {user.surname}</Link>
                                        <span className="user-info__divider"> | </span>
                                        <Link to={"/social/profile/" + user._id} className="user-info__create-date"><ReactTimeAgo date={user.created_at} locale="es-MX" /></Link>
                                    </div>

                                    <h4 className="post__content">{user.bio}</h4>

                                </div>

                            </div>

                            {user._id != auth._id &&
                                <div className="post__buttons">

                                    {!followings.some(followedUser => followedUser._id === user._id) ? (
                                        <button className="post__button post__button--green" onClick={() => follow(user._id)}>
                                            Follow
                                        </button>
                                    ) : (
                                        <button className="post__button" onClick={() => unfollow(user._id)}>
                                            Unfollow
                                        </button>
                                    )}

                                </div>
                            }

                        </article>
                    );
                })}



            </div>

            {loading ? <div>Loading...</div> : ""}

            {more &&
                <div className="content__container-btn">
                    <button className="content__btn-more-post" onClick={nextPage}>
                        Show more people
                    </button>
                </div>
            }
        </>

    )
}
