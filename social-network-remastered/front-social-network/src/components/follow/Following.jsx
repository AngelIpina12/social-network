import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserList } from '../user/UserList'
import {
    useFetchUserProfileQuery,
    useFetchUserFollowingsQuery,
    setFollowings,
    incrementFollowingsPage,
} from '../../store';

export const Following = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { data: profileData, isLoading: profileLoading, error: profileError } = useFetchUserProfileQuery({ userId: params.userId });
    const user = profileData ? profileData.user : null;
    const followingsState = useSelector((state) => state.followData.followings);
    const { data: apiData, error, isLoading, isFetching } = useFetchUserFollowingsQuery({
        userId: params.userId,
        page: followingsState.page,
    });

    useEffect(() => {
        if (apiData && apiData.status === 'success') {
            const newFollowings = apiData.follows?.map(follow => follow.followed) || [];
            const merged = followingsState.page === 1
                ? newFollowings
                : deduplicate([...followingsState.data, ...newFollowings]);

            dispatch(setFollowings({
                data: merged,
                page: followingsState.page,
                totalPages: apiData.pages,
            }));
        }
    }, [apiData, dispatch, followingsState.page]);

    const deduplicate = (arr) => {
        const unique = {};
        arr.forEach(item => {
            unique[item._id] = item;
        });
        return Object.values(unique);
    };

    const loadMore = () => {
        if (followingsState.page < followingsState.totalPages) dispatch(incrementFollowingsPage());
    };

    if ((isLoading || profileLoading) && followingsState.page === 1) return <div>Loading...</div>;
    if ((error || profileError)) return <div>Error</div>;

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Users followed by {user.name} {user.surname}</h1>
            </header>
            <UserList
                users={followingsState.data}
                getUsers={loadMore}
                loading={isFetching}
                more={followingsState.page < followingsState.totalPages}
            />
            <br />
        </>
    )
}
