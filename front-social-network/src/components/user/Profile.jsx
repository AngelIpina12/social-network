import React, { useEffect, useState } from 'react'
import avatar from '../../assets/img/user.png'
import { GetProfile } from '../../helpers/getProfile'
import { Link, useParams } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';

export const Profile = () => {
    const { auth } = useAuth();
    const [userProfile, setUserProfile] = useState({});
    const [counters, setCounters] = useState({});
    const [iFollow, setIFollow] = useState(false);
    const [publications, setPublications] = useState([])

    const params = useParams();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            const dataUser = await GetProfile(params.userId, setUserProfile, token);
            if (dataUser.following && dataUser.following._id) setIFollow(true);
            getCounters();
        }
        fetchData();
        getPublications();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const dataUser = await GetProfile(params.userId, setUserProfile, token);
            if (dataUser.following && dataUser.following._id) setIFollow(true);
            getCounters();
        }
        fetchData();
        getPublications();
    }, [params]);

    const getCounters = async () => {
        const response = await fetch(`${Global.url}user/counter/${params.userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        const data = await response.json();
        if (data.userId) {
            setCounters(data);
        }
    };

    const follow = async (id) => {
        const response = await fetch(Global.url + 'follow/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ followed: id })
        })
        const data = await response.json();
        if (data.status === "success") {
            setIFollow(true);
        }
    };

    const unfollow = async (id) => {
        const response = await fetch(Global.url + 'follow/unfollow/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        const data = await response.json();
        if (data.status === "success") {
            setIFollow(false);
        }
    };

    const getPublications = async (nextPage = 1) => {
        const response = await fetch(`${Global.url}publication/user/${params.userId}/${nextPage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        const data = await response.json();
        if (data.status === "success") {
            setPublications(data.publications.docs);
        }
    }

    return (
        <>

            <header className="aside__profile-info">



                <div className="profile-info__general-info">
                    <div className="general-info__container-avatar">
                        {userProfile.image != "default.jpg" && <img src={Global.url + "user/avatar/" + userProfile.image} className="container-avatar__img" alt="Foto de perfil" />}
                        {userProfile.image == "default.jpg" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}
                    </div>

                    <div className="general-info__container-names">
                        <div href="#" className="container-names__name">
                            <h1>{userProfile.name} {userProfile.surname}</h1>
                            {userProfile._id != auth._id &&
                                (iFollow ?
                                    <button onClick={() => unfollow(userProfile._id)} className="content__button content__button--right post__button">Unfollow</button>
                                    :
                                    <button onClick={() => follow(userProfile._id)} className="content__button content__button--right">Follow</button>)
                            }
                        </div>
                        <h2 className="container-names__nickname">{userProfile.nick}</h2>
                        <p>{userProfile.bio}</p>
                    </div>
                </div>

                <div className="profile-info__stats">

                    <div className="stats__following">
                        <Link to={"/social/followings/" + userProfile._id} className="following__link">
                            <span className="following__title">Followings</span>
                            <span className="following__number">{counters.following >= 1 ? counters.following : 0}</span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link to={"/social/followeds/" + userProfile._id} className="following__link">
                            <span className="following__title">Followeds</span>
                            <span className="following__number">{counters.followed >= 1 ? counters.followed : 0}</span>
                        </Link>
                    </div>


                    <div className="stats__following">
                        <Link to={"/social/profile/" + userProfile._id} className="following__link">
                            <span className="following__title">Publications</span>
                            <span className="following__number">{counters.publication >= 1 ? counters.publication : 0}</span>
                        </Link>
                    </div>


                </div>
            </header >

            <div className="content__posts">

                {publications.map(publication => {
                    return (
                        <article className="posts__post" key={publication._id}>

                            <div className="post__container">

                                <div className="post__image-user">
                                    <Link to={"/social/profile/" + publication.user._id} className="post__image-link">
                                        {publication.user.image != "default.jpg" && <img src={Global.url + "user/avatar/" + publication.user.image} className="post__user-image" alt="Foto de perfil" />}
                                        {publication.user.image == "default.jpg" && <img src={avatar} className="post__user-image" alt="Foto de perfil" />}
                                    </Link>
                                </div>

                                <div className="post__body">

                                    <div className="post__user-info">
                                        <a href="#" className="user-info__name">{publication.user.name} {publication.user.surname}</a>
                                        <span className="user-info__divider"> | </span>
                                        <a href="#" className="user-info__create-date">{publication.created_at}</a>
                                    </div>

                                    <h4 className="post__content">{publication.text}</h4>

                                </div>

                            </div>

                            {auth._id == publication.user._id &&
                                <div className="post__buttons">

                                    <a href="#" className="post__button">
                                        <i className="fa-solid fa-trash-can"></i>
                                    </a>

                                </div>
                            }

                        </article>
                    );
                })}

            </div>


            <div className="content__container-btn">
                <button className="content__btn-more-post">
                    Ver mas publicaciones
                </button>
            </div>
        </>

    )
}
