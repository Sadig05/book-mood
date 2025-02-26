// src/components/ProfileLoader.tsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useProfile } from "@/api/queries/profileQueries";
import { setCurrentUser } from "@/redux/userSlice";


const ProfileLoader = () => {
  const dispatch = useDispatch();
  const { data: profile, isSuccess } = useProfile();

  useEffect(() => {
    if (isSuccess && profile) {
      // Update Redux store with profile data
      dispatch(setCurrentUser({
        id: profile.id,
        username: profile.username,
      }));
    }
  }, [isSuccess, profile, dispatch]);

  return null;
};

export default ProfileLoader;
