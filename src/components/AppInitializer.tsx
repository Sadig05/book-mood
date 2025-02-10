// src/AppInitializer.tsx
import { BASE_URL } from '@/api/reactQuery';
import { setCurrentUser } from '@/redux/userSlice';
import  { useEffect } from 'react';
import { useDispatch } from 'react-redux';


export const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${BASE_URL}/auth/current_user`, {
          method: 'GET',
          credentials: 'include', // ensures cookies are sent
        });
        if (response.ok) {
          const userData = await response.json();
          dispatch(setCurrentUser(userData)); // update Redux with user data
        } else {
          console.error('Failed to fetch current user');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  return null;
};
