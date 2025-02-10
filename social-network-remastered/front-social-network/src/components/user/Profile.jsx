import React, { useEffect, useState } from 'react'
import avatar from '../../assets/img/user.png'
import { GetProfile } from '../../helpers/GetProfile'
import { Link, useParams } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { PublicationList } from '../publication/PublicationList';

export const Profile = () => {
    const { auth } = useAuth();
    const [userProfile, setUserProfile] = useState({});
    const [counters, setCounters] = useState({});
    const [iFollow, setIFollow] = useState(false);
    const [publications, setPublications] = useState([])
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);

    const params = useParams();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            const dataUser = await GetProfile(params.userId, setUserProfile, token);
            if (dataUser.following && dataUser.following._id) setIFollow(true);
            getCounters();
        }
        fetchData();
        getPublications(1, true);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const dataUser = await GetProfile(params.userId, setUserProfile, token);
            if (dataUser.following && dataUser.following._id) setIFollow(true);
            getCounters();
        }
        fetchData();
        setMore(true);
        getPublications(1, true);
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

    const getPublications = async (nextPage = 1, newProfile = false) => {
        const response = await fetch(`${Global.url}publication/user/${params.userId}/${nextPage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        const data = await response.json();
        console.log(data)
        if (data.status === "success") {
            let newPublications = data.publications.docs;
            if (!newProfile && publications.length >= 1) {
                newPublications = [...publications, ...data.publications.docs];
            }
            if (newProfile) {
                newPublications = data.publications.docs;
                setMore(true);
                setPage(1);
            }
            setPublications(newPublications);
            if (!newProfile && publications.length >= (data.total - data.publications.docs.length)) {
                setMore(false);
            }
            if (data.totalPages <= 1) {
                setMore(false);
            }
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
                        <Link to={"/social/following/" + userProfile._id} className="following__link">
                            <span className="following__title">Followings</span>
                            <span className="following__number">{counters.following >= 1 ? counters.following : 0}</span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link to={"/social/followers/" + userProfile._id} className="following__link">
                            <span className="following__title">Followeds</span>
                            <span className="following__number">{counters.followed >= 1 ? counters.followed : 0}</span>
                        </Link>
                    </div>


                    <div className="stats__following">
                        <Link to={"/social/profile/" + userProfile._id} className="following__link">
                            <span className="following__title">Publications</span>
                            <span className="following__number">{counters.publications >= 1 ? counters.publications : 0}</span>
                        </Link>
                    </div>


                </div>
            </header >

            <PublicationList
                publications={publications}
                getPublications={getPublications}
                page={page}
                setPage={setPage}
                more={more}
                setMore={setMore} />

        </>

    )
}
