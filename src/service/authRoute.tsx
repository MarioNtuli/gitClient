import { FC, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export interface IAuthRouteProps {
  children?: React.ReactNode;
}
const AuthRoute: FC<IAuthRouteProps> = (props) => {
  const { children } = props;
  const auth = getAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    AuthCheck();
    return () => AuthCheck();
  }, [auth]);

  const AuthCheck = onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsLoading(false);
    } else {
      navigate("/Login");
    }
  });
  if (isLoading) return <div>Loading...</div>;
  return <>{children}</>;
};
export default AuthRoute;
