import React, { createContext, useEffect, useState } from 'react';
import { useFetchUserProfileQuery, useFetchCountersQuery } from '../store';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const [auth, setAuth] = useState({});
  const [counter, setCounter] = useState({});
  const [loading, setLoading] = useState(false);

  const skipQueries = !token || !userStr;
  let userId = null;
  if (!skipQueries) {
    const userObj = JSON.parse(userStr);
    userId = userObj.id;
  }
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useFetchUserProfileQuery({ userId }, { skip: skipQueries });

  const {
    data: countersData,
    isLoading: countersLoading,
    error: countersError,
  } = useFetchCountersQuery({ userId }, { skip: skipQueries });

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
    <AuthContext.Provider value={{ auth: skipQueries ? {} : auth, setAuth, counter: skipQueries ? {} : counter, setCounter: () => { }, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;