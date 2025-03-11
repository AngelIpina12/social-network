import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import avatar from '../../assets/img/user.png'
import { Global } from '../../helpers/Global';
import { useDeletePublicationMutation } from '../../store';

export const PublicationList = ({ publications, getPublications, more, loading, nextPage }) => {
    const auth = useSelector((state) => state.authData.user);
    
    // Delete publication mutation
    const [deletePublication, { isLoading: isDeleting }] = useDeletePublicationMutation();

    // Delete publication handler
    const handleDeletePublication = async (id) => {
        if (isDeleting) return;
        if (confirm("Are you sure you want to delete this publication?")) {
            try {
                await deletePublication({ publicationId: id }).unwrap();
            } catch (err) {
                console.error("Error deleting publication:", err);
            }
        }
    };

    // Check if there are no publications
    if (!publications || publications.length === 0) {
        return (
            <div className="content__posts">
                <p className="content__no-posts">No publications to show</p>
            </div>
        );
    }

    return (
        <>
            <div className="content__posts">
                {publications.map(publication => {
                    return (
                        <article className="posts__post" key={publication._id}>
                            <div className="post__container">
                                <div className="post__image-user">
                                    <Link to={`/social/profile/${publication.user._id}`} className="post__image-link">
                                        {publication.user.image && publication.user.image !== "default.jpg" ? (
                                            <img
                                                src={`${Global.url}user/avatar/${publication.user.image}`}
                                                className="post__user-image"
                                                alt="Profile"
                                            />
                                        ) : (
                                            <img
                                                src={avatar}
                                                className="post__user-image"
                                                alt="Profile"
                                            />
                                        )}
                                    </Link>
                                </div>

                                <div className="post__body">
                                    <div className="post__user-info">
                                        <Link to={`/social/profile/${publication.user._id}`} className="user-info__name font-bold">
                                            {publication.user.name} {publication.user.surname}
                                        </Link>
                                        <span className="user-info__divider"> | </span>
                                        <span className="user-info__create-date">
                                            <ReactTimeAgo date={new Date(publication.created_at).getTime()} locale='es-MX' />
                                        </span>
                                    </div>

                                    <h4 className="post__content">{publication.text}</h4>

                                    {publication.file && (
                                        <img
                                            src={`${Global.url}publication/media/${publication.file}`}
                                            className="post__image"
                                            alt='Publication image'
                                        />
                                    )}
                                </div>
                            </div>
                            {auth?._id === publication.user._id && (
                                <div className="post__buttons">
                                    <button
                                        onClick={() => handleDeletePublication(publication._id)}
                                        className="post__button post__button--delete"
                                        disabled={isDeleting}
                                    >
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>
            
            {loading && (
                <div className="content__loading-more">
                    Loading more publications...
                </div>
            )}

            {more && !loading && (
                <div className="content__container-btn">
                    <button
                        className="content__btn-more-post"
                        onClick={nextPage}
                    >
                        Show more publications
                    </button>
                </div>
            )}
        </>
    )
}