import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { UserList } from './UserList'
import { useFetchListOfUsersQuery } from '../../store';
import { resetUsers, setCurrentPage } from '../../store/slices/userSlice';

export const People = () => {
    const dispatch = useDispatch();
    const { currentPage, users, following, pages, loading, error } = useSelector((state) => state.userData);
    const { data, isLoading, error: fetchError } = useFetchListOfUsersQuery({ page: currentPage });

    useEffect(() => {
        dispatch(resetUsers());
    }, [dispatch]);

    if (isLoading && currentPage === 1) return <div>Loading...</div>;
    if (fetchError) return <div>Error loading users</div>;

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">People</h1>
            </header>
            <UserList
                users={users}
                currentPage={currentPage}
                following={following}
                loading={isLoading}
                more={currentPage < pages}
            />
            <br />
        </>
    )
}
