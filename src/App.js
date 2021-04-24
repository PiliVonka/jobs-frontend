import React, { useState } from "react";

import {
  Typography,
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  makeStyles,
  colors,
  ThemeProvider,
  AppBar,
  Toolbar,
  Divider,
  InputBase,
} from "@material-ui/core";

import { fade } from "@material-ui/core/styles";

import {
  Search,
  Phone,
  LocationOn,
  Instagram,
  Android
} from "@material-ui/icons";

import InfiniteScroll from "react-infinite-scroller";

import gql from "graphql-tag";

import { useQuery, NetworkStatus } from "@apollo/react-hooks";
import theme from "./theme";

const GET_JOBS = gql`
  query GetJobs($searchValue: String!, $skip: Int) {
    jobs(searchValue: $searchValue, skip: $skip) {
      id
      title
      description
      jobDate
      created,
      phone,
      location
    }
  }
`;

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.dark,
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "80%",
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(10),
    color: colors.red
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const JobList = () => {
  const classes = useStyles();
  const [inputText, setInputText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const { fetchMore, loading, error, data, networkStatus } = useQuery(GET_JOBS, {
    variables: { searchValue, skip: 0 },
    notifyOnNetworkStatusChange: true,
  });

  const loadingMoreJobs = networkStatus === NetworkStatus.fetchMore;

  if ((loading || loadingMoreJobs) && (!error && !data)) {
    return (
      <Typography>
        {"Loading.."}
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography>
        {JSON.stringify(error)}
      </Typography>
    );
  }

  const { jobs } = data;
  const loadMoreJobs = () => {
    if (loading || loadingMoreJobs) return;
    fetchMore({
      variables: {
        searchValue,
        skip: jobs.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        console.log({ prev, fetchMoreResult });
        if (!fetchMoreResult) return prev;
        return {
          jobs: [...prev.jobs, ...fetchMoreResult.jobs]
        };
      }
    });
  };

  const onTextChange = (e) => {
    setInputText(e.target.value);
  };

  const clickSearch = () => {
    setSearchValue(inputText);
  };
  console.log({ jobs });
  return (
    <Container>
    <AppBar>
    <Toolbar>
      <Logo />
        <div className={classes.search}>
            <div className={classes.searchIcon}>
              <Search />
            </div>
            <InputBase
              placeholder="Программист"
              inputProps={{ "aria-label": "search" }}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              onChange={onTextChange}
              onKeyPress={e => e.key === "Enter" ? clickSearch() : null}
              value={inputText}
              label="Поиск"
              variant="outlined"
            />
        </div>
        <div>
          <Instagram />
          <Android />
        </div>
    </Toolbar>
    </AppBar>
      <Container className={classes.root} maxWidth={false}>
          {jobs && jobs.length && <InfiniteScroll
              pageStart={0}
              loadMore={loadMoreJobs}
              hasMore={true || false}
              loader={<div className="loader" key={0}>Loading ...</div>}>
          <Grid container
              spacing={3}
              direction="row"
              justify="flex-start"
              alignItems="flex-start">
            {jobs.map(job => (
              <Grid item key={job.id} lg={12} sm={12} xl={12} xs={12}>
                <Card>
                  <CardHeader
                    title={job.title}
                    subheader={new Date(parseInt(job.created)).toLocaleString("ru-RU")}
                  />
                  <CardContent>
                    <Typography component="p">
                      {job.description}
                    </Typography>
                    <Typography variant="caption">
                      <Phone color="primary" />
                      {job.phone}
                    </Typography>
                    <Divider orientation="vertical" />
                    <Typography variant="caption">
                      <LocationOn color="secondary"/>
                      {job.location}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            </Grid>
          </InfiniteScroll>
        }
      </Container>
    </Container>
  );
};

const Logo = () => {
  return <img alt="Logo" src={`${process.env.PUBLIC_URL}/logo192.png`} width="50" height="50"/>;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <JobList />
    </ThemeProvider>
  );
};

export default App;
