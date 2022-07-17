import { getAuth, signOut } from "firebase/auth";
import { FunctionComponent, useContext, useEffect } from "react";
import { getCommitsFromGitHub } from "../../../api/agent";
import { LoginContext } from "../../../shared/Context";

interface IHomeProps {}

const Home: FunctionComponent<IHomeProps> = (props) => {
  const auth = getAuth();
  const { token, email } = useContext(LoginContext);
  useEffect(() => {
    getCommitsFromGitHub(token || "", email || "").then((response) => {
      console.log(response);
    });
  });
  return (
    <div>
      <h1>{email}</h1>
      <button onClick={() => signOut(auth)}>Sign out</button>
    </div>
  );
};

export default Home;
