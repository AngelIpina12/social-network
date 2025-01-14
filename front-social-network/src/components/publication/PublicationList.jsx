import React from 'react'
import avatar from '../../assets/img/user.png'
import { Link } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';

export const PublicationList = ({publications, getPublications, page, setPage, more, setMore}) => {
    const { auth } = useAuth();
    const token = localStorage.getItem('token');

    const deletePublication = async (id) => {
        const response = await fetch(`${Global.url}publication/remove/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        const data = await response.json();
        setPage(1);
        setMore(true);
        getPublications(1, true);
    }

    const nextPage = () => {
        let next = page + 1
        setPage(next);
        getPublications(next);
    }

    return (
        <>
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

                                    {publication.file && <img src={`${Global.url}publication/media/${publication.file}`} />}
                                </div>

                            </div>

                            {auth._id == publication.user._id &&
                                <div className="post__buttons">

                                    <button onClick={() => deletePublication(publication._id)} className="post__button post__button--delete">
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>

                                </div>
                            }

                        </article>
                    );
                })}

            </div>
            {
                more &&
                <div className="content__container-btn">
                    <button className="content__btn-more-post" onClick={nextPage}>
                        Show more publications
                    </button>
                </div>
            }
        </>
    )
}
