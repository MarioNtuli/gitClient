import { createContext } from "react";

export interface IUser {
  token: string;
  email: string;
  userName: string;
  setUserToken?: (token: string, email: string) => void;
  setUserName?: (userName: string) => void;
}

export const LoginContext = createContext<Partial<IUser>>({});
