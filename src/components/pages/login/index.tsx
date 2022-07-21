import { FunctionComponent, useContext, useEffect, useState } from "react";
import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Grid, Paper } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import styles from "./indexStyles";
import { grey } from "@mui/material/colors";
import { LoginContext } from "../../../shared/Context";
interface ILoginProps {}

const Login: FunctionComponent<ILoginProps> = (props) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [isAuthenticate, setIsAuthenticate] = useState<boolean>(false);
  const classes = styles();
  const { setUserToken } = useContext(LoginContext);

  const signInWithGit = async () => {
    setIsAuthenticate(true);
    const provider = new GithubAuthProvider();
    provider.addScope("repo");
    signInWithPopup(auth, provider)
      .then((response) => {
        const credential = GithubAuthProvider.credentialFromResult(response);
        if (credential) {
          const token = credential.accessToken || "";
          const email = response.user.email || "";
          if (setUserToken) {
            setUserToken(token, email);
          }
        }
        navigate("/");
      })
      .catch((error) => {
        const errorMessage = error.message;
        const credential = GithubAuthProvider.credentialFromError(error);
        setIsAuthenticate(false);
      });
  };
  return (
    <Grid>
      <Paper elevation={10} className={classes.paperStyle}>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Avatar sx={{ bgcolor: grey[900] }}>
            <GitHubIcon />
          </Avatar>
          <h2>Sign in with GitHub</h2>
          <Button
            variant="contained"
            color="success"
            onClick={() => signInWithGit()}
            disabled={isAuthenticate}
          >
            continue
          </Button>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Login;
