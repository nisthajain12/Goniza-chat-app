import { createContext, useState } from "react";

export type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  profileComplete: boolean;
  setProfileComplete: (val: boolean) => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  profileComplete: false,
  setProfileComplete: () => {}
});

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);
  const [profileComplete, setProfileComplete] = useState(false);

  return (
    <AuthContext.Provider
      value={{ token, setToken, profileComplete, setProfileComplete }}
    >
      {children}
    </AuthContext.Provider>
  );
};
