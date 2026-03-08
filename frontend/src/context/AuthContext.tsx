import { createContext, useState, useEffect } from "react";

export type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  profileComplete: boolean;
  setProfileComplete: (val: boolean) => void;

  user: any;
  setUser: (user: any) => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  profileComplete: false,
  setProfileComplete: () => {},

  user: null,
  setUser: () => {}
});

export const AuthProvider = ({ children }: any) => {

  // loading token from localStorage
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [profileComplete, setProfileComplete] = useState(false);

  const [user, setUser] = useState<any>(null);

  // storing token in localStorage
  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }

    setTokenState(newToken);
  };

  // ✅ NEW — Fetch profile when token exists
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/profile/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
console.log("PROFILE DATA:", data);

        if (data.profile) {
          setUser(data.profile);
          setProfileComplete(true);
        } else {
          setProfileComplete(false);
        }

      } catch (error) {
        console.error("Profile fetch failed");
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        profileComplete,
        setProfileComplete,

        // ✅ NEW
        user,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};