import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import avatar from '../../assets/img/user.png'
import { Global } from '../../helpers/Global';
import {
    useCreateUserFollowMutation,
    useDeleteUserFollowMutation,
    addFollowing,
    removeFollowing,
} from '../../store';

export const UserList = ({ users, getUsers, loading, more }) => {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.authData.user);
    const followings = useSelector((state) => state.followData.followings.data);
    
    // RTK Query mutations
    const [createUserFollow, { isLoading: isFollowing }] = useCreateUserFollowMutation();
    const [deleteUserFollow, { isLoading: isUnfollowing }] = useDeleteUserFollowMutation();

    // Follow a user
    const follow = async (id) => {
        if (isFollowing) return;
        try {
            const response = await createUserFollow({ userId: id }).unwrap();
            if (response.status === "success") {
                const followInfo = {
                    _id: response.follow.followed,
                    created_at: response.follow.created_at
                };
                dispatch(addFollowing(followInfo));
            }
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    // Unfollow a user
    const unfollow = async (id) => {
        if (isUnfollowing) return;
        
        try {
            const response = await deleteUserFollow({ userId: id }).unwrap();
            
            if (response.status === "success") {
                dispatch(removeFollowing(id));
            }
        } catch (error) {
            console.error("Error unfollowing user:", error);
        }
    };

    // Check if the user list is empty
    if (!users || users.length === 0) {
        return (
            <div className="content__posts">
                <p className="content__no-posts">No users to show</p>
            </div>
        );
    }

    return (
        <>
            <div className="content__posts">
                {users.map(user => {
                    const isFollowing = followings.some(followedUser => followedUser._id === user._id);
                    
                    return (
                        <article className="posts__post" key={user._id}>
                            <div className="post__container">
                                <div className="post__image-user">
                                    <Link to={`/social/profile/${user._id}`} className="post__image-link">
                                        {user.image !== "default.jpg" ? (
                                            <img 
                                                src={`${Global.url}user/avatar/${user.image}`} 
                                                className="post__user-image" 
                                                alt="Profile" 
                                            />
                                        ) : (
                                            <img 
                                                src={avatar} 
                                                className="post__user-image" 
                                                alt="Profile" 
                                            />
                                        )}
                                    </Link>
                                </div>

                                <div className="post__body">
                                    <div className="post__user-info">
                                        <Link to={`/social/profile/${user._id}`} className="user-info__name">
                                            {user.name} {user.surname}
                                        </Link>
                                        <span className="user-info__divider"> | </span>
                                        <Link to={`/social/profile/${user._id}`} className="user-info__create-date">
                                            <ReactTimeAgo date={new Date(user.created_at).getTime()} locale="es-MX" />
                                        </Link>
                                    </div>

                                    <h4 className="post__content">{user.bio}</h4>
                                </div>
                            </div>
                            {user._id !== auth?._id && (
                                <div className="post__buttons">
                                    {!isFollowing ? (
                                        <button 
                                            className="post__button post__button--green" 
                                            onClick={() => follow(user._id)}
                                            disabled={isFollowing}
                                        >
                                            Follow
                                        </button>
                                    ) : (
                                        <button 
                                            className="post__button" 
                                            onClick={() => unfollow(user._id)}
                                            disabled={isUnfollowing}
                                        >
                                            Unfollow
                                        </button>
                                    )}
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>

            {loading && <div className="content__loading">Loading users...</div>}

            {more && !loading && (
                <div className="content__container-btn">
                    <button 
                        className="content__btn-more-post" 
                        onClick={getUsers}
                    >
                        Show more users
                    </button>
                </div>
            )}
        </>
    )
}