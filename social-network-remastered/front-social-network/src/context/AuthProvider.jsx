import React, { createContext, useEffect, useState } from 'react';
import { useFetchUserProfileQuery, useFetchCountersQuery } from '../store';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const [auth, setAuth] = useState({});
  const [counter, setCounter] = useState({});
  const [loading, setLoading] = useState(false);

  if (!token || !userStr) {
    return (
      <AuthContext.Provider value={{ auth: {}, setAuth: () => {}, counter: {}, setCounter: () => {}, loading: false }}>
        {children}
      </AuthContext.Provider>
    );
  }

  const userObj = JSON.parse(userStr);
  const userId = userObj.id;
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useFetchUserProfileQuery({ userId });
  const {
    data: countersData,
    isLoading: countersLoading,
    error: countersError,
  } = useFetchCountersQuery({ userId });

  useEffect(() => {
    setLoading(profileLoading || countersLoading);
  }, [profileLoading, countersLoading]);

  useEffect(() => {
    if (profileData && profileData.user) {
      const { password, ...userWithoutPassword } = profileData.user;
      setAuth(userWithoutPassword);
    }
  }, [profileData]);

  useEffect(() => {
    if (countersData) {
      setCounter(countersData);
    }
  }, [countersData]);

  if (profileError || countersError) {
    console.error("Error fetching profile or counters:", profileError || countersError);
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, counter, setCounter, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;