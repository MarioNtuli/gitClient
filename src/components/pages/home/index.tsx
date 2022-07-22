import {
  alpha,
  AppBar,
  Badge,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputBase,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { getAuth, signOut } from "firebase/auth";
import {
  Fragment,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import {
  addFavorite,
  getComments,
  getCommitsFromGitHub,
  getGitUser,
} from "../../../api/agent";
import { LoginContext } from "../../../shared/Context";
import FavoriteIcon from "@mui/icons-material/Favorite";
import styles from "./indexStyles";
import LastPageIcon from "@mui/icons-material/LastPage";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { ToastContainer, toast } from "react-toastify";
import LoginIcon from "@mui/icons-material/Login";
import CloseIcon from "@mui/icons-material/Close";
import "react-toastify/dist/ReactToastify.css";

interface IHomeProps {}

export interface ICommit {
  URLCommit: string;
  CommitMassage: string;
  UserName: string | undefined;
  DateCommit: String | undefined;
  Repo?: string;
  Sha: string;
  commentURL: string;
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <LastPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

interface TableComponentProps {
  commits: ICommit[];
}

const TableComponent: FunctionComponent<TableComponentProps> = ({
  commits,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - commits.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <TableContainer component={Paper} sx={{ maxWidth: 800 }}>
      <Table aria-label="custom pagination table">
        <TableBody>
          {(rowsPerPage > 0
            ? commits.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : commits
          ).map((row) => (
            <TableRow key={row.URLCommit}>
              <TableCell component="th" scope="row">
                <ListItem key={row.URLCommit} alignItems="flex-start">
                  <ListItemText
                    primary={row.CommitMassage}
                    secondary={
                      <Fragment>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {row.UserName}
                        </Typography>
                        {` --committed on ${row.DateCommit}`}
                      </Fragment>
                    }
                  />
                </ListItem>
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={commits.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

const Home: FunctionComponent<IHomeProps> = (props) => {
  const [commits, setCommits] = useState<ICommit[]>([]);
  const [allCommits, setAllCommits] = useState<ICommit[]>([]);
  const [favoriteCommits, setFavoriteCommits] = useState<ICommit[]>([]);
  const auth = getAuth();
  const { token, email, userName, setUserName } = useContext(LoginContext);
  const classes = styles();
  const [open, setOpen] = useState<boolean>(false);
  const [count, setCounter] = useState<number>(0);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const name = urlParams.get("name");

  const increment = (): any => {
    setCounter(count + 1);
  };

  const fetchComments = async (commitTemp: ICommit) => {
    let favorites: ICommit[] = [];
    await getComments(token || "", commitTemp).then((response) => {
      response.data.forEach((y) => {
        if (
          y.body === "Client favorite" &&
          favorites.filter((z) => z.commentURL === commitTemp.commentURL)
            .length <= 0
        ) {
          favorites.push(commitTemp);
          increment();
        }
      });
    });
    setFavoriteCommits([...favoriteCommits, ...favorites]);
  };

  const fetchCommits = () => {
    getCommitsFromGitHub(token || "", userName || "").then((response) => {
      let commitsTemp: ICommit[] = [];

      response.data.items.forEach(async (x) => {
        let commitTemp: ICommit = {
          CommitMassage: x.commit.message,
          URLCommit: x.comments_url,
          DateCommit: x.commit.author.date,
          UserName: x.commit.author.name,
          Repo: x.repository.name,
          Sha: x.sha,
          commentURL: x.comments_url,
        };
        commitsTemp.push(commitTemp);

        if (token) {
          fetchComments(commitTemp);
        }

        setCommits(commitsTemp);
        setAllCommits(commitsTemp);
      });
    });
  };

  useEffect(() => {
    if ((name === "" || !name) && token) {
      getGitUser(token || "").then((res) => {
        if (setUserName) {
          setUserName(res.data.login);
        }
      });
    } else if (name) {
      if (setUserName) setUserName(name);
    }
  }, []);

  useEffect(() => {
    if (userName) {
      fetchCommits();
    }
  }, [userName]);

  const onSearch = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.preventDefault();
    const search = event.currentTarget;
    const filteredCommits = commits.filter(
      (x) =>
        x.UserName?.search(search.value) !== -1 ||
        x.DateCommit?.search(search.value) !== -1 ||
        x.URLCommit?.search(search.value) !== -1 ||
        x.CommitMassage?.search(search.value) !== -1
    );
    if (search.value) {
      setCommits(filteredCommits);
    } else {
      setCommits(allCommits);
    }
  };
  const addFavoriteOnclick = (commit: ICommit) => {
    if (token) {
      addFavorite(token || "", commit).then((response) => {
        if (response.status === 201) {
          if (
            favoriteCommits.filter((x) => x.URLCommit === commit.URLCommit)
              .length <= 0
          ) {
            setFavoriteCommits([...favoriteCommits, commit]);
            increment();
          }
          toast("Added commit to favorite");
        } else toast("Failed to Add commit to favorite");
      });
    } else {
      signOut(auth);
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Grid container spacing={0} alignItems="center" justifyContent="center">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
              >
                Client
              </Typography>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                  onChange={(event) => onSearch(event)}
                />
              </Search>
              <MenuItem onClick={handleClickOpen}>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                >
                  <Badge badgeContent={count} color="error">
                    <FavoriteIcon />
                  </Badge>
                </IconButton>
                <p>Favorite</p>
              </MenuItem>
              <MenuItem onClick={() => signOut(auth)}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="primary-search-account-menu"
                  aria-haspopup="true"
                  color="inherit"
                >
                  <LoginIcon />
                </IconButton>
                <p>Logout</p>
              </MenuItem>
            </Toolbar>
          </AppBar>
        </Box>
      </Grid>
      <div>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            Favorite
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <TableComponent commits={favoriteCommits} />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </div>

      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        className={classes.gridContainer}
      >
        <TableComponent commits={commits} />
      </Grid>
    </>
  );
};

export default Home;
