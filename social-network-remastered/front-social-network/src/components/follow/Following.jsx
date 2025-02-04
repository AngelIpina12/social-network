import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import { UserList } from '../user/UserList'
import { useParams } from 'react-router-dom';
import { GetProfile } from '../../helpers/GetProfile';
import { useFetchUserFollowingQuery } from '../../store/apis/followApi';



export const Following = () => {
    const params = useParams();
    const token = localStorage.getItem('token');

    const [currentPage, setCurrentPage] = useState(1);
    const [allUsers, setAllUsers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [userProfile, setUserProfile] = useState({});

    const { data, error, isLoading, isFetching } = useFetchUserFollowingQuery({
        id: params.userId,
        page: currentPage,
    });

    useEffect(() => {
        GetProfile(params.userId, setUserProfile, token);
    }, [params.userId, token]);

    useEffect(() => {
        if (data && data.status === 'success') {
            const newUsers = data.follows?.map(follow => follow.followed) || [];
            setAllUsers(prev => (currentPage === 1 ? newUsers : [...prev, ...newUsers]));
            if (data.user_following) {
                setFollowing(data.user_following);
            }
        }
    }, [data, currentPage]);

    const loadMore = () => setCurrentPage(prev => prev + 1);

    if (isLoading && currentPage === 1) return <div>Loading...</div>;
    if (error) return <div>Error</div>;

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Users followed by {userProfile.name} {userProfile.surname}</h1>
            </header>
            <UserList
                users={allUsers}
                getUsers={loadMore}
                following={following}
                setFollowing={setFollowing}
                loading={isFetching}
            />
            <br />
        </>
    )
}
