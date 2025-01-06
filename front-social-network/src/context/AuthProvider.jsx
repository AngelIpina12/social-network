import React, { createContext, useEffect, useState } from 'react'
import { Global } from '../helpers/Global';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({});
    const [counter, setCounter] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        authUser()
    }, [])
    const authUser = async () => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if (!token || !user) {
            setLoading(false);
            return false;
        }
        const userObj = JSON.parse(user);
        const userId = userObj.id;
        const response = await fetch(Global.url + "user/profile/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        const data = await response.json();
        const responseCounters = await fetch(Global.url + "user/counter/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        const dataCounters = await responseCounters.json();
        setAuth(data.user);
        setCounter(dataCounters);
        setLoading(false);
    }
  return (
    <AuthContext.Provider value={{auth, setAuth, counter, setCounter, loading}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;
