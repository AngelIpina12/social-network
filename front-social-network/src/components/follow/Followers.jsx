import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import { UserList } from '../user/UserList'
import { useParams } from 'react-router-dom';
import { GetProfile } from '../../helpers/GetProfile';

export const Followers = () => {
    const [users, setUsers] = useState([]);
    const [more, setMore] = useState(true);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userProfile, setUserProfile] = useState({});

    const params = useParams();
    const token = localStorage.getItem('token');

    useEffect(() => {
        getUsers(1);
        GetProfile(params.userId, setUserProfile, token)
    }, []);

    const getUsers = async (nextPage = 1) => {
        setLoading(true);
        const userId = params.userId;
        const response = await fetch(Global.url + 'follow/followers/' + userId + "/" + nextPage, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        const data = await response.json();
        let cleanUsers = [];
        data.follows.forEach(follow => {
            cleanUsers = [...cleanUsers, follow.user];
        })
        data.users = cleanUsers
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
                <h1 className="content__title">Users who follow {userProfile.name} {userProfile.surname}</h1>
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
