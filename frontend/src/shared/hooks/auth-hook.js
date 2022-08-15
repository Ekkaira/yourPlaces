import { useState, useCallback, useEffect } from "react";

let logoutTimer; // General var for standalone timer.

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationTime, setTokenExpirationTime] = useState();
  const [userId, setUserId] = useState(false);

  // Login functionality + automatic login.
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    // Creating or keeping expiration date for token.
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); // mil seconts * seconds * minutes = +1h.
    setTokenExpirationTime(tokenExpirationDate);
    // Using localStorage to store user ID token on his side.
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  // Logout functionality + automatic logout.
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationTime(null);
    setUserId(null);
    localStorage.removeItem("userData"); // Clearing localStorage on Log out.
  }, []);

  // Setting a token timer on login and clearing it on logout.
  useEffect(() => {
    if (token && tokenExpirationTime) {
      const remainingTime =
        tokenExpirationTime.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationTime]);

  // useEffect runs after render cycle.
  // Using useEffect to get user stored data(userId & token) for automatic login on refresh.
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date() // Checking if expiration date is in future, aka token is still valid.
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);
  return { token, login, logout, userId };
};
