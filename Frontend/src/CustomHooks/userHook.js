import { useState, useEffect } from "react";

const useUserStatusHook = (isUserLoggedIn, isUserAdmin) => {
  const [userStatus, setUserStatus] = useState({
    isLoading: true,
    isLoggedIn: false,
    isAdmin: false,
  });

  useEffect(() => {
    async function checkStatus() {
      try {
        const authStatusResponse = await isUserLoggedIn();
        const adminStatusResponse = await isUserAdmin();

        setUserStatus({
          isLoading: false,
          isLoggedIn: authStatusResponse,
          isAdmin: adminStatusResponse,
        });
      } catch (error) {
        setUserStatus({ isLoading: false, isLoggedIn: false, isAdmin: false });
      }
    }

    checkStatus();
  }, []); // Pass function itself as dependency if it's stable

  return userStatus;
};

export default useUserStatusHook;
