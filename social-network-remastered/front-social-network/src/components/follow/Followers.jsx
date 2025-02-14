import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserList } from '../user/UserList'
import {
    useFetchUserProfileQuery,
    useFetchUserFollowersQuery,
    setFollowers,
    incrementFollowersPage,
} from '../../store';

export const Followers = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { data: profileData, isLoading: profileLoading, error: profileError } = useFetchUserProfileQuery({ userId: params.userId });
    const user = profileData ? profileData.user : null;
    const followersState = useSelector((state) => state.followData.followers);
    const { data: apiData, error, isLoading, isFetching } = useFetchUserFollowersQuery({
        userId: params.userId,
        page: followersState.page,
    });

    useEffect(() => {
        if (apiData && apiData.status === 'success') {
            const newFollowers = apiData.follows?.map(follow => follow.user) || [];
            const merged = followersState.page === 1
                ? newFollowers
                : deduplicate([...followersState.data, ...newFollowers]);
            dispatch(setFollowers({
                data: merged,
                page: followersState.page,
                totalPages: apiData.pages,
            }));
        }
    }, [apiData, dispatch, followersState.page]);

    const deduplicate = (arr) => {
        const map = {};
        arr.forEach(item => map[item._id] = item);
        return Object.values(map);
    };

    const loadMore = () => {
        if (followersState.page < followersState.totalPages) dispatch(incrementFollowersPage());
    }

    if ((isLoading || profileLoading) && followersState.page === 1) return <div>Loading...</div>;
    if ((error || profileError)) return <div>Error</div>;

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Users who follow {user.name} {user.surname}</h1>
            </header>
            <UserList
                users={followersState.data}
                getUsers={loadMore}
                loading={isFetching}
                more={followersState.page < followersState.totalPages}
            />
            <br />
        </>
    )
}
