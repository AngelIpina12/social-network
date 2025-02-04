import React, { useEffect, useState } from 'react'
import { UserList } from '../user/UserList'
import { useParams } from 'react-router-dom';
import { GetProfile } from '../../helpers/GetProfile';
import { useFetchUserFollowersQuery } from '../../store';

export const Followers = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [allUsers, setAllUsers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [userProfile, setUserProfile] = useState({});
    const [more, setMore] = useState(true);
    const params = useParams();
    const token = localStorage.getItem('token');

    const { data, error, isLoading, isFetching } = useFetchUserFollowersQuery({
        userId: params.userId,
        page: currentPage,
    });

    useEffect(() => {
        GetProfile(params.userId, setUserProfile, token)
    }, [params.userId, token]);

    useEffect(() => {
        if (data && data.status === 'success') {
            const newUsers = data.follows?.map(follow => follow.user) || [];
            setAllUsers(prev => currentPage === 1 ? newUsers : [...prev, ...newUsers]);
            if (data.user_following) {
                setFollowing(data.user_following);
            }
            if (currentPage >= data.pages) {
                setMore(false);
            }
        }
    }, [data, currentPage]);

    const loadMore = () => setCurrentPage(prev => prev + 1);

    if (isLoading && currentPage === 1) return <div>Loading...</div>;
    if (error) return <div>Error</div>;

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Users who follow {userProfile.name} {userProfile.surname}</h1>
            </header>
            <UserList
                users={allUsers}
                getUsers={loadMore}
                following={following}
                setFollowing={setFollowing}
                loading={isFetching}
                more={more}
            />
            <br />
        </>
    )
}
