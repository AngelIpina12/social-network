import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserList } from '../user/UserList'
import {
    useFetchUserProfileQuery,
    useFetchUserFollowingsQuery,
    setFollowings,
    incrementFollowingsPage,
    resetFollowState
} from '../../store';

export const Following = () => {
    const params = useParams();
    const dispatch = useDispatch();
    
    // Get user profile
    const { data: profileData, isLoading: profileLoading, error: profileError } = useFetchUserProfileQuery(
        { userId: params.userId },
        { refetchOnMountOrArgChange: true }
    );
    
    const user = profileData ? profileData.user : null;
    const followingsState = useSelector((state) => state.followData.followings);
    
    // Fetch followings
    const { data: apiData, error, isLoading, isFetching } = useFetchUserFollowingsQuery({
        userId: params.userId,
        page: followingsState.page,
    });

    // Reset state when component unmounts
    useEffect(() => {
        return () => {
            dispatch(resetFollowState());
        };
    }, [dispatch]);

    // Process data when API responds
    useEffect(() => {
        if (apiData && apiData.status === 'success') {
            const newFollowings = apiData.follows?.map(follow => follow.followed) || [];
            const merged = followingsState.page === 1
                ? newFollowings
                : deduplicate([...followingsState.data, ...newFollowings]);
            dispatch(setFollowings({
                data: merged,
                page: followingsState.page,
                totalPages: apiData.pages || 0,
            }));
        }
    }, [apiData, dispatch, followingsState.page]);

    // Helper to deduplicate users by ID
    const deduplicate = (arr) => {
        const unique = {};
        arr.forEach(item => {
            unique[item._id] = item;
        });
        return Object.values(unique);
    };

    // Function to load more followings
    const loadMore = () => {
        if (followingsState.page < followingsState.totalPages) {
            dispatch(incrementFollowingsPage());
        }
    };

    // Loading and error states
    if ((isLoading || profileLoading) && followingsState.page === 1) {
        return <div className="content__loading">Loading following users...</div>;
    }
    
    if ((error || profileError)) {
        return <div className="content__error">Error loading following users</div>;
    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Users followed by {user?.name} {user?.surname}</h1>
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