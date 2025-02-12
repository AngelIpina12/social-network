import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserList } from '../user/UserList'
import { useGetProfile } from '../../helpers/useGetProfile';
import {
    useFetchUserFollowingsQuery,
    setFollowings,
    setFollowingsLoading,
    setFollowingsError
} from '../../store';

export const Following = () => {
    const params = useParams();
    const dispatch = useDispatch();

    const { user, isLoading: profileLoading, error: profileError } = useGetProfile(params.userId);
    const followingsState = useSelector((state) => state.followData.followings);
    const { data: apiData, error, isLoading, isFetching } = useFetchUserFollowingsQuery({
        userId: params.userId,
        page: followingsState.page,
    });

    useEffect(() => {
        if (apiData && apiData.status === 'success') {
            const newFollowings = apiData.follows?.map(follow => follow.followed) || [];
            dispatch(setFollowings({
                data: followingsState.page === 1 ? newFollowings : [...followingsState.data, ...newFollowings],
                page: followingsState.page,
                totalPages: apiData.pages,
            }));
        }
    }, [apiData, dispatch, followingsState.page]);

    const loadMore = () => {
        dispatch(setFollowingsLoading(true));
        dispatch(setFollowings({
            data: followingsState.data,
            page: followingsState.page + 1,
            totalPages: followingsState.totalPages,
        }));
    };

    if (isLoading && followingsState.page === 1) return <div>Loading...</div>;
    if (error) {
        dispatch(setFollowingsError(error.toString()));
        return <div>Error</div>;
    }

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
