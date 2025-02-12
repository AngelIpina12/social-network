import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserList } from '../user/UserList'
import { useGetProfile } from '../../helpers/useGetProfile';
import {
    useFetchUserFollowersQuery,
    setFollowers,
    setFollowersLoading,
    setFollowersError
} from '../../store';

export const Followers = () => {
    const params = useParams();
    const dispatch = useDispatch();

    const { user, isLoading: profileLoading, error: profileError } = useGetProfile(params.userId);
    const followersState = useSelector((state) => state.followData.followers);
    const { data: apiData, error, isLoading, isFetching } = useFetchUserFollowersQuery({
        userId: params.userId,
        page: followersState.page,
    });

    useEffect(() => {
        if (apiData && apiData.status === 'success') {
            const newFollowers = apiData.follows?.map(follow => follow.user) || [];
            dispatch(setFollowers({
                data: followersState.page === 1 ? newFollowers : [...followersState.data, ...newFollowers],
                page: followersState.page,
                totalPages: apiData.pages
            }));
        }
    }, [apiData, dispatch, followersState.page]);

    const loadMore = () => {
        dispatch(setFollowersLoading(true));
        dispatch(setFollowers({
            data: followersState.data,
            page: followersState.page + 1,
            totalPages: followersState.totalPages
        }))
    }

    if (isLoading && followersState.page === 1) return <div>Loading...</div>;
    if (error) {
        dispatch(setFollowersError(error.toString()));
        return <div>Error</div>;
    }

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
