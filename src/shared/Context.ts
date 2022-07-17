import { createContext } from "react";

export interface IUser {
  token: string;
  email: string;
  setUserToken?: (token: string, email: string) => void;
}

export const LoginContext = createContext<Partial<IUser>>({});
