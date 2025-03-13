import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { UserList } from './UserList'
import { useFetchListOfUsersQuery, resetUsers, setUserPage } from '../../store';

export const People = () => {
    const dispatch = useDispatch();
    const { currentPage, users, following, pages, loading } = useSelector((state) => state.userData);

    // Fetch users using RTK Query
    const { data, isLoading, isFetching, error, refetch } = useFetchListOfUsersQuery(
        { page: currentPage },
        { refetchOnMountOrArgChange: true }
    );

    // Reset users state when component mounts
    useEffect(() => {
        dispatch(resetUsers());
    }, [dispatch]);

    // Load more users when "Show more users" is clicked
    const loadMoreUsers = () => {
        if (currentPage < pages) {
            dispatch(setUserPage(currentPage + 1));
        }
    };

    // Refresh users list
    const refreshUsers = () => {
        dispatch(resetUsers());
        dispatch(setUserPage(1));
        refetch();
    };

    if (isLoading && currentPage === 1) {
        return <div className="content__loading">Loading users...</div>;
    }

    if (error) {
        return (
            <div className="content__error">
                <h2>Error loading users</h2>
                <p>{error.message || 'An unexpected error occurred'}</p>
                <button className="content__button" onClick={refreshUsers}>
                    Try again
                </button>
            </div>
        );
    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">People</h1>
                <button 
                    className="content__button" 
                    onClick={refreshUsers}
                    disabled={isFetching}
                >
                    {isFetching ? 'Refreshing...' : 'Refresh'}
                </button>
            </header>

            <UserList
                users={users}
                getUsers={loadMoreUsers}
                loading={isFetching}
                more={currentPage < pages}
            />
            
            <br />
        </>
    )
}