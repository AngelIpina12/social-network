import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import { UserList } from '../user/UserList'
import { useParams } from 'react-router-dom';

export const Followers = () => {
    const [users, setUsers] = useState([]);
    const [more, setMore] = useState(true);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(false);

    const params = useParams();

    useEffect(() => {
        getUsers(1);
    }, []);

    const getUsers = async (nextPage = 1) => {
        setLoading(true);
        const userId = params.userId;
        const response = await fetch(Global.url + 'follow/followers/' + userId + "/" + nextPage, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
        const data = await response.json();
        let cleanUsers = [];
        data.follows.forEach(follow => {
            cleanUsers = [...cleanUsers, follow.user];
        })
        data.users = cleanUsers
        console.log(data.users)
        if (data.users && data.status === "success") {
            let newUsers = data.users;
            if (users.length >= 1) {
                newUsers = [...users, ...data.users];
            }
            setUsers(newUsers);
            setFollowing(data.user_following);
            setLoading(false);
            if (users.length >= (data.total - data.users.length)) {
                setMore(false);
            }
        }
    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Users who follow me</h1>
            </header>
            <UserList
                users={users}
                getUsers={getUsers}
                following={following}
                setFollowing={setFollowing}
                loading={loading}
                more={more}
            />
            <br />
        </>
    )
}
