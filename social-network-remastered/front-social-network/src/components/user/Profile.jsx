import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import avatar from '../../assets/img/user.png'
import { Global } from '../../helpers/Global';
import { PublicationList } from '../publication/PublicationList';
import {
    useCreateUserFollowMutation,
    useDeleteUserFollowMutation,
    useFetchUserPublicationsQuery,
    useFetchCountersQuery,
    useFetchUserProfileQuery,
    addFollowing,
    removeFollowing,
    getUserPublications,
    setCurrentPage
} from '../../store';

export const Profile = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.authData.user);
    const userPublicationsState = useSelector(state => state.publicationData.userPublications);
    const userPublications = useSelector(getUserPublications);
    const counters = useSelector((state) => state.countersData[userId]) || { following: 0, followed: 0, publications: 0 };
    const myFollowings = useSelector(state => state.followData.followings.data);
    const iFollow = myFollowings.some(follow => follow._id === userId);
    const { data: profileData, isLoading: profileLoading, error: profileError } = useFetchUserProfileQuery(
        { userId },
        { refetchOnMountOrArgChange: true }
    );
    const { isLoading: countersLoading } = useFetchCountersQuery({ userId });
    
    const { isLoading: publicationsLoading, isFetching: publicationsFetching, refetch: refetchPublications } = useFetchUserPublicationsQuery({
        userId,
        page: userPublicationsState.currentPage
    });
    const [createUserFollow, { isLoading: isFollowing }] = useCreateUserFollowMutation();
    const [deleteUserFollow, { isLoading: isUnfollowing }] = useDeleteUserFollowMutation();
    const userProfile = profileData?.user || {};

    // Seguir al usuario
    const follow = async () => {
        if (isFollowing) return;
        try {
            const response = await createUserFollow({ userId }).unwrap();
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

    // Dejar de seguir
    const unfollow = async (id) => {
        if (isUnfollowing) return;
        
        try {
            const response = await deleteUserFollow({ userId }).unwrap();
            if (response.status === "success") {
                dispatch(removeFollowing(userId));
            }
        } catch (error) {
            console.error("Error al dejar de seguir:", error);
        }
    };

    // Función para cargar la siguiente página de publicaciones.
    const nextPage = () => {
        if (userPublicationsState.currentPage < userPublicationsState.totalPages) {
            dispatch(setCurrentPage({
                section: 'userPublications',
                page: userPublicationsState.currentPage + 1
            }));
        }
    };

    // Resetear publicaciones.
    const refreshPublications = () => {
        dispatch(setCurrentPage({ section: 'userPublications', page: 1 }));
        refetchPublications();
    };

    if (profileLoading || countersLoading) {
        return <div className="content__loading">Cargando perfil...</div>;
    }
    
    if (profileError) {
        return <div className="content__error">Error al cargar perfil: {profileError.message}</div>;
    }

    return (
        <>
            <header className="aside__profile-info">
                <div className="profile-info__general-info">
                    <div className="general-info__container-avatar">
                        {userProfile.image && userProfile.image !== "default.jpg" ? (
                            <img 
                                src={`${Global.url}user/avatar/${userProfile.image}`} 
                                className="container-avatar__img" 
                                alt="Foto de perfil" 
                            />
                        ) : (
                            <img 
                                src={avatar} 
                                className="container-avatar__img" 
                                alt="Foto de perfil" 
                            />
                        )}
                    </div>
                    
                    <div className="general-info__container-names">
                        <div className="container-names__name">
                            <h1>{userProfile.name} {userProfile.surname}</h1>
                            
                            {userProfile._id !== auth?._id && (
                                iFollow ? (
                                    <button 
                                        onClick={unfollow} 
                                        className="content__button content__button--right post__button"
                                        disabled={isUnfollowing}
                                    >
                                        Dejar de seguir
                                    </button>
                                ) : (
                                    <button 
                                        onClick={follow} 
                                        className="content__button content__button--right"
                                        disabled={isFollowing}
                                    >
                                        Seguir
                                    </button>
                                )
                            )}
                        </div>
                        
                        <h2 className="container-names__nickname">{userProfile.nick}</h2>
                        <p>{userProfile.bio}</p>
                    </div>
                </div>
                
                <div className="profile-info__stats">
                    <div className="stats__following">
                        <Link to={`/social/following/${userProfile._id}`} className="following__link">
                            <span className="following__title">Siguiendo</span>
                            <span className="following__number">{counters.following >= 1 ? counters.following : 0}</span>
                        </Link>
                    </div>
                    
                    <div className="stats__following">
                        <Link to={`/social/followers/${userProfile._id}`} className="following__link">
                            <span className="following__title">Seguidores</span>
                            <span className="following__number">{counters.followed >= 1 ? counters.followed : 0}</span>
                        </Link>
                    </div>
                    
                    <div className="stats__following">
                        <Link to={`/social/profile/${userProfile._id}`} className="following__link">
                            <span className="following__title">Publicaciones</span>
                            <span className="following__number">{counters.publications >= 1 ? counters.publications : 0}</span>
                        </Link>
                    </div>
                </div>
            </header>
            
            {publicationsLoading && userPublicationsState.currentPage === 1 ? (
                <div className="content__loading">Cargando publicaciones...</div>
            ) : (
                <PublicationList
                    publications={userPublications}
                    getPublications={refreshPublications}
                    more={userPublicationsState.currentPage < userPublicationsState.totalPages}
                    loading={publicationsFetching}
                    nextPage={nextPage}
                />
            )}
        </>
    )
}
