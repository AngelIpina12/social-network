import { useFetchUserProfileQuery } from '../store';

export const useGetProfile = (userId) => {
    const { data, isLoading, error } = useFetchUserProfileQuery({ userId });
    return { user: data ? data.user : null, isLoading, error };
  };