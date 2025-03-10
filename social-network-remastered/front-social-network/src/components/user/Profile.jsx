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
} from '../../store';

export const Profile = () => {
    const { userId } = useParams();
    const auth = useSelector((state) => state.authData.user);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const [accumulatedPublications, setAccumulatedPublications] = useState([]);
    const dispatch = useDispatch();
    const {
        data: publicationsData,
        error: publicationsError,
        isLoading: publicationsLoading,
        refetch: refetchPublications,
    } = useFetchUserPublicationsQuery({ userId, page });
    const { data: countersData, isLoading: countersLoading } = useFetchCountersQuery({ userId });
    const { data, isLoading: profileLoading, error: profileError } = useFetchUserProfileQuery(
        { userId },
        { refetchOnFocus: true, refetchOnMountOrArgChange: true }
    );
    const counters = useSelector((state) => state.countersData[userId]) || { following: 0, followed: 0, publications: 0 };
    const [iFollow, setIFollow] = useState(false);
    const userProfile = data ? data.user : null;
    const [createUserFollow] = useCreateUserFollowMutation();
    const [deleteUserFollow] = useDeleteUserFollowMutation();

    // Actualizamos las publicaciones acumuladas.
    useEffect(() => {
        if (publicationsData && publicationsData.publications) {
            if (page === 1) {
                setAccumulatedPublications(publicationsData.publications.docs);
            } else {
                setAccumulatedPublications(prev => {
                    const combined = [...prev, ...publicationsData.publications.docs];
                    const unique = Array.from(new Map(combined.map(item => [item._id, item])).values());
                    return unique;
                });
            }
            setMore(page < publicationsData.publications.totalPages);
        }
    }, [publicationsData, page]);

    // Actualiza el estado de seguimiento en función del perfil
    useEffect(() => {
        if (userProfile && userProfile.following && userProfile.following._id) {
            setIFollow(true);
        } else {
            setIFollow(false);
        }
    }, [userProfile]);

    // Seguir al usuario
    const follow = async (id) => {
        try {
            const response = await createUserFollow({ userId: id }).unwrap();
            if (response.status === "success") {
                const followInfo = {
                    _id: response.follow.followed,
                    created_at: response.follow.created_at
                };
                dispatch(addFollowing(followInfo));
                setIFollow(true);
            }
        } catch (error) {
            console.error("Error al seguir usuario:", error);
        }
    };

    // Dejar de seguir
    const unfollow = async (id) => {
        try {
            const response = await deleteUserFollow({ userId: id }).unwrap();
            if (response.status === "success") {
                dispatch(removeFollowing(id));
                setIFollow(false);
            }
        } catch (error) {
            console.error("Error al dejar de seguir:", error);
        }
    };

    // Función para cargar la siguiente página de publicaciones.
    const nextPage = async () => {
        const next = page + 1;
        if (publicationsData && page < publicationsData.publications.totalPages) {
            setPage(next);
        } else {
            setMore(false);
        }
    };

    // Resetear publicaciones.
    const getPublications = async () => {
        setPage(1);
        setAccumulatedPublications([]);
        refetchPublications();
    }

    if (profileLoading || publicationsLoading || countersLoading) return <div>Loading...</div>;
    if (profileError) return <div>Error loading profile</div>;
    if (publicationsError) return <div>Error loading publications</div>;

    return (
        <>
            <header className="aside__profile-info">
                <div className="profile-info__general-info">
                    <div className="general-info__container-avatar">
                        {userProfile.image && userProfile.image !== "default.jpg" ? (
                            <img src={Global.url + "user/avatar/" + userProfile.image} className="container-avatar__img" alt="Profile photo" />
                        ) : (
                            <img src={avatar} className="container-avatar__img" alt="Profile photo" />
                        )}
                    </div>
                    <div className="general-info__container-names">
                        <div href="#" className="container-names__name">
                            <h1>{userProfile.name} {userProfile.surname}</h1>
                            {userProfile._id !== auth?._id && (
                                iFollow ? (
                                    <button onClick={() => unfollow(userProfile._id)} className="content__button content__button--right post__button">
                                        Unfollow
                                    </button>
                                ) : (
                                    <button onClick={() => follow(userProfile._id)} className="content__button content__button--right">
                                        Follow
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
                publications={accumulatedPublications}
                getPublications={getPublications}
                page={page}
                setPage={setPage}
                more={more}
                setMore={setMore}
                nextPage={nextPage}
            />
        </>
    )
}
