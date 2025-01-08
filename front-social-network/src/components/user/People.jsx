import React, { useEffect, useState } from 'react'
import avatar from '../../assets/img/user.png'
import { Global } from '../../helpers/Global'
import useAuth from '../../hooks/useAuth'

export const People = () => {
    const { auth } = useAuth()
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getUsers(1);
    }, []);

    const getUsers = async (nextPage = 1) => {
        setLoading(true);
        const response = await fetch(Global.url + 'user/list/' + nextPage, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
        const data = await response.json();
        if (data.users && data.status === "success") {
            let newUsers = data.users;
            if (users.length >= 1) {
                newUsers = [...users, ...data.users];
            }
            setUsers(newUsers);
            setFollowing(data.user_following);
            setLoading(false);
            if (users.length >= (data.total - data.users.length)) {
                setMore(false);
            }
        }
    }

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
            setFollowing([...following, id]);
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
            setFollowing(following.filter(user => user !== id));
        }
    }


    return (
        <>

            <header className="content__header">
                <h1 className="content__title">People</h1>
            </header>

            <div className="content__posts">

                {users.map(user => {
                    return (
                        <article className="posts__post" key={user._id}>

                            <div className="post__container">

                                <div className="post__image-user">
                                    <a href="#" className="post__image-link">
                                        {user.image != "default.jpg" && <img src={Global.url + "user/avatar/" + user.image} className="post__user-image" alt="Foto de perfil" />}
                                        {user.image == "default.jpg" && <img src={avatar} className="post__user-image" alt="Foto de perfil" />}
                                    </a>
                                </div>

                                <div className="post__body">

                                    <div className="post__user-info">
                                        <a href="#" className="user-info__name">{user.name} {user.surname}</a>
                                        <span className="user-info__divider"> | </span>
                                        <a href="#" className="user-info__create-date">{user.created_at}</a>
                                    </div>

                                    <h4 className="post__content">{user.bio}</h4>

                                </div>

                            </div>

                            {user._id != auth._id &&
                                <div className="post__buttons">

                                    {!following.includes(user._id) &&
                                        <button className="post__button post__button--green" onClick={() => follow(user._id)}>
                                            Follow
                                        </button>
                                    }

                                    {following.includes(user._id) &&
                                        <button className="post__button" onClick={() => unfollow(user._id)}>
                                            Unfollow
                                        </button>
                                    }

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

            <br />
        </>
    )
}
