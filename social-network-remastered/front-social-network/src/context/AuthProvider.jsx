import React, { createContext } from 'react';
import { useFetchUserProfileQuery, useFetchCountersQuery } from '../store'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) {
    return (
      <AuthContext.Provider value={{ auth: {}, counter: {}, loading: false }}>
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
  const loading = profileLoading || countersLoading;
  const authUser = profileData ? profileData.user : {};
  const counter = countersData || {};

  if (profileError || countersError) {
    console.error("Error fetching profile or counters:", profileError || countersError);
  }

  return (
    <AuthContext.Provider value={{ auth: authUser, counter, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;