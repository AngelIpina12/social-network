import React, { useEffect, useRef, useState } from 'react'
import { Global } from '../../helpers/Global'
import { UserList } from './UserList'
import { useFetchListOfUsersQuery } from '../../store';

export const People = () => {
    const [users, setUsers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const { data, isLoading, error, refetch } = useFetchListOfUsersQuery({ page });

    // Cada vez que cambie la data o la página, se actualiza el estado local
    useEffect(() => {
        if (data && data.status === "success") {
          setUsers(prev => 
            page === 1 
              ? data.users 
              : [...prev, ...data.users.filter(newUser => !prev.some(existing => existing._id === newUser._id))]
          );
          setFollowing(data.user_following);
          setMore(data.pages ? page < data.pages : true);
        }
      }, [data, page]);

    const getUsers = (nextPage) => {
        if (data && nextPage > data.totalPages) return;
        setPage(nextPage);
    }

    if (isLoading && page === 1) return <div>Loading...</div>;
    if (error) return <div>Error loading users</div>;

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">People</h1>
            </header>
            <UserList
                users={users}
                getUsers={getUsers}
                currentPage={page}
                following={following}
                setFollowing={setFollowing}
                loading={isLoading}
                more={more}
            />
            <br />
        </>
    )
}
