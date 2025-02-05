import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import avatar from '../../assets/img/user.png'
import { Global } from '../../helpers/Global';
import { addFollowing, removeFollowing } from '../../store';

export const UserList = ({ users, getUsers, loading, more }) => {
    const { auth } = useAuth();
    const dispatch = useDispatch();
    const followings = useSelector((state) => state.followData.followings.data)
    const [page, setPage] = useState(1);

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        getUsers(next);
    }

    const follow = async (id) => {
        const response = await fetch(Global.url + 'follow/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ followed: id })
        })
        const data = await response.json();
        if (data.status === "success") {
            const followInfo = {
                _id: data.follow.followed,
                created_at: data.follow.created_at
            };
            dispatch(addFollowing(followInfo));
        }
    }

    const unfollow = async (id) => {
        const response = await fetch(Global.url + 'follow/unfollow/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
        const data = await response.json();
        if (data.status === "success") {
            dispatch(removeFollowing(id));
        }
    }

    return (
        <>
            <div className="content__posts">

                {users.map(user => {
                    return (
                        <article className="posts__post" key={user._id}>

                            <div className="post__container">

                                <div className="post__image-user">
                                    <Link to={"/social/profile/" + user._id} className="post__image-link">
                                        {user.image != "default.jpg" && <img src={Global.url + "user/avatar/" + user.image} className="post__user-image" alt="Foto de perfil" />}
                                        {user.image == "default.jpg" && <img src={avatar} className="post__user-image" alt="Foto de perfil" />}
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
