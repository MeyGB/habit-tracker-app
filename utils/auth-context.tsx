import React, { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "./Appwrite";

type AuthContextType = {
  currentuser: Models.User<Models.Preferences> | null;
  isLoadingUser: boolean;
  isLoadingAuth: boolean;

  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>; 
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentuser, setCurrentUser] =
    useState<Models.User<Models.Preferences> | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  const refreshUser = async () => {
    try {
      const user = await account.get();
      setCurrentUser(user);
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      setIsLoadingUser(true);
      await refreshUser();
      setIsLoadingUser(false);
    })();
  }, []);

  const signUp = async (email: string, password: string) => {
    setIsLoadingAuth(true);
    try {
      await account.create(ID.unique(), email, password);
      await signIn(email, password);
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : "Signup failed";
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoadingAuth(true);
    try {
      await account.createEmailPasswordSession(email, password);
      await refreshUser();
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : "Signin failed";
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const signOut = async () => {
    setIsLoadingAuth(true);
    try {
      await account.deleteSession("current");
      setCurrentUser(null);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentuser,
        isLoadingUser,
        isLoadingAuth,
        signUp,
        signIn,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
