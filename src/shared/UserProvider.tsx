import { FunctionComponent, useState } from "react";
import { LoginContext } from "./Context";

interface UserProviderProps {
  children?: React.ReactNode;
}

const UserProvider: FunctionComponent<UserProviderProps> = (props) => {
  const [token, setToken] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userName, setName] = useState<string>("");
  const setUserToken = (token: string, email: string) => {
    setToken(token);
    setEmail(email);
  };
  const setUserName = (userName: string) => {
    setName(userName);
  };
  const { children } = props;
  return (
    <LoginContext.Provider
      value={{
        token,
        email,
        userName,
        setUserToken,
        setUserName,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default UserProvider;
