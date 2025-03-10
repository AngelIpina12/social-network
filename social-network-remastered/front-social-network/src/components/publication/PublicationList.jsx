import React from 'react'
import avatar from '../../assets/img/user.png'
import { Link } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import { useSelector } from 'react-redux';
import ReactTimeAgo from 'react-time-ago';
import { useDeletePublicationMutation } from '../../store';

export const PublicationList = ({publications, getPublications, page, setPage, more, setMore, nextPage}) => {
    const auth = useSelector((state) => state.authData.user);
    const [deletePublication] = useDeletePublicationMutation();

    const handleDeletePublication = async (id) => {
        try {
            const result = await deletePublication({ publicationId: id }).unwrap();
            if (result.status === "success") {
                setPage(1);
                getPublications();
            } else {
                console.error("Fallo al eliminar la publicación:", result);
            }
        } catch (err) {
            console.error("Error al eliminar publicación:", err);
        }
    };

    return (
        <>
            <div className="content__posts">

                {publications.map(publication => {
                    return (
                        <article className="posts__post" key={publication._id}>

                            <div className="post__container">

                                <div className="post__image-user">
                                    <Link to={"/social/profile/" + publication.user._id} className="post__image-link">
                                        {publication.user.image != "default.jpg" && <img src={`${Global.url}user/avatar/${publication.user.image}`} className="post__user-image" alt="Foto de perfil" />}
                                        {publication.user.image == "default.jpg" && <img src={avatar} className="post__user-image" alt="Foto de perfil" />}
                                    </Link>
                                </div>

                                <div className="post__body">

                                    <div className="post__user-info">
                                        <Link to={"/social/profile/" + publication.user._id} className="user-info__name font-bold">{publication.user.name} {publication.user.surname}</Link>
                                        <span className="user-info__divider"> | </span>
                                        <a href="#" className="user-info__create-date"><ReactTimeAgo date={new Date(publication.created_at).getTime()} locale='es-MX'/></a>
                                    </div>

                                    <h4 className="post__content">{publication.text}</h4>

                                    {publication.file && <img src={`${Global.url}publication/media/${publication.file}`} alt='Publication' />}
                                </div>

                            </div>

                            {auth?._id == publication.user._id &&
                                <div className="post__buttons">

                                    <button onClick={() => handleDeletePublication(publication._id)} className="post__button post__button--delete">
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
