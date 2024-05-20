"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { authInstance, instance } from "./axios-config"; //instance for login request, authInstance for modification
import { useRouter } from "next/navigation";

// user's data
interface User {
  id: number;
  fullName: string;
  email: string;
  isAdmin: number;
  createdAt: string;
  updatedAt: string;
}

// bearer token information
interface Token {
  type: string;
  name: string | null;
  token: string;
  abilities: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
}

// object contained both user's date and bearer token information
interface AuthData {
  user: User;
  token: Token;
}
// params for login method
interface loginForm {
  email: string;
  password: string;
}
// values our createContext has
interface AuthContextType {
  authData: AuthData | null;
  userLogin: (loginForm: loginForm) => Promise<any>;
}
// children type
interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  async function userLogin(loginForm: loginForm) {
    try {
      const { status, request, data } = await instance.post("auth", loginForm);
      //if sucess, setitem localstorage to persist itens(authData disaper after refresh), set data to authData
      if ((request.status ?? status) === 200) {
        // set item
        setAuthData(data);
        localStorage.setItem("token", data.token.token);
        localStorage.setItem("userId", data.user.id);
        // update axios authInstace with the token and userId
        // token
        authInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.token.token}`;
        //user id
        authInstance.defaults.params = { userId: data.user.id };
        // redirecting
        if (data.user.isAdmin) {
          router.push("/suporte");
        } else {
          router.push("/guest");
        }
      }
    } catch (error) {
      return "fail";
    }
  }
  useEffect(() => {
    const token = `Bearer ${localStorage.getItem("token")}`;
    const userId = localStorage.getItem("userId");

    authInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    authInstance.defaults.params = { userId: userId };
    setLoading(false);
  }, []);
  return (
    <AuthContext.Provider value={{ authData, userLogin }}>
      {loading ? (
        <span className="loading loading-infinity loading-xs"></span>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
