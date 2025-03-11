import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserList } from '../user/UserList'
import {
    useFetchUserProfileQuery,
    useFetchUserFollowersQuery,
    setFollowers,
    incrementFollowersPage,
    resetFollowState
} from '../../store';

export const Followers = () => {
    const params = useParams();
    const dispatch = useDispatch();
    
    // Get user profile data
    const { data: profileData, isLoading: profileLoading, error: profileError } = useFetchUserProfileQuery(
        { userId: params.userId },
        { refetchOnMountOrArgChange: true }
    );
    
    const user = profileData ? profileData.user : null;
    const followersState = useSelector((state) => state.followData.followers);
    
    // Fetch followers data
    const { data: apiData, error, isLoading, isFetching } = useFetchUserFollowersQuery({
        userId: params.userId,
        page: followersState.page,
    });

    // Reset followers state when component unmounts
    useEffect(() => {
        return () => {
            dispatch(resetFollowState());
        };
    }, [dispatch]);

    // Process followers data when API responds
    useEffect(() => {
        if (apiData && apiData.status === 'success') {
            const newFollowers = apiData.follows?.map(follow => follow.user) || [];
            const merged = followersState.page === 1
                ? newFollowers
                : deduplicate([...followersState.data, ...newFollowers]);
            dispatch(setFollowers({
                data: merged,
                page: followersState.page,
                totalPages: apiData.pages || 0,
            }));
        }
    }, [apiData, dispatch, followersState.page]);

    // Helper function to deduplicate users by ID
    const deduplicate = (arr) => {
        const map = {};
        arr.forEach(item => map[item._id] = item);
        return Object.values(map);
    };

    // Function to load more followers
    const loadMore = () => {
        if (followersState.page < followersState.totalPages) {
            dispatch(incrementFollowersPage());
        }
    }

    if ((isLoading || profileLoading) && followersState.page === 1) {
        return <div className="content__loading">Loading followers...</div>;
    }
    
    if ((error || profileError)) {
        return <div className="content__error">Error loading followers</div>;
    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Users who follow {user?.name} {user?.surname}</h1>
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