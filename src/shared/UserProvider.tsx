import { FunctionComponent, useEffect, useState } from "react";
import { LoginContext } from "./Context";

interface UserProviderProps {
  children?: React.ReactNode;
}

const UserProvider: FunctionComponent<UserProviderProps> = (props) => {
  const [token, setToken] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userName, setName] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && token === "") {
      const user = JSON.parse(storedUser);
      setToken(user.token);
      setName(user.userName);
      setEmail(user.userEmail);
    } else {
      const user = JSON.stringify({
        token: token,
        userName: userName,
        email: email,
      });

      localStorage.setItem("token", token);
      localStorage.setItem("user", user);
    }
  }, [token, userName]);
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
