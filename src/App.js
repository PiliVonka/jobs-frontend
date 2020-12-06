import React, { useState } from "react";

import {
  Typography,
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  InputBase,
  IconButton,
  makeStyles,
  colors,
  ThemeProvider,
  AppBar,
  Toolbar,
  Divider,
} from "@material-ui/core";

import {
  Search,
  Phone,
  LocationOn
} from "@material-ui/icons";

import { Spin } from "antd";

import gql from "graphql-tag";

import { useQuery } from "@apollo/react-hooks";
import theme from "./theme";

const GET_JOBS = gql`
  query GetJobs($searchValue: String!) {
    jobs(searchValue: $searchValue) {
      id
      title
      description
      created,
      phone,
      location
    }
  }
`;

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "80%",
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(10),
    color: colors.red
  }
}));

const JobList = () => {
  const classes = useStyles();

  const [inputText, setInputText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const { loading, error, data } = useQuery(GET_JOBS, { variables: { searchValue } });

  if (loading || (!data && !error)) {
    return (
      <Spin />
    );
  }

  if (error) {
    return (
      <Typography>
        {JSON.stringify(error)}
      </Typography>
    );
  }

  const onTextChange = (e) => {
    setInputText(e.target.value);
  };

  const clickSearch = () => {
    setSearchValue(inputText);
  };

  console.log({ loading, data, error });

  const { jobs } = data;
  return (
      <Container className={classes.root} maxWidth={false}>
        <Grid container
                spacing={3}
                direction="row"
                justify="flex-start"
                alignItems="flex-start">
          <Grid item key="filter" lg={12} sm={12} xl={12} xs={12}>
            <InputBase
              className={classes.input}
              placeholder="Поиск"
              inputProps={{ "aria-label": "search" }}
              onChange={onTextChange}
              value={inputText}
            />
            <IconButton
              onClick={clickSearch}
              type="submit"
              className={classes.iconButton}
              aria-label="search">
              <Search />
            </IconButton>
          </Grid>
          {jobs.map(job => (
            <Grid item key={job.id} lg={4} sm={4} xl={4} xs={12}>
              <Card minHeight={800}>
                <CardHeader
                  title={job.title}
                  subheader={job.created}
                />
                <CardContent>
                  <Typography component="p">
                    {job.description}
                  </Typography>
                  <Typography variant="caption">
                    <Phone />
                    {job.phone}
                  </Typography>
                  <Divider orientation="vertical" />
                  <Typography variant="caption">
                    <LocationOn />
                    {job.location}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
  );
};

const Logo = () => {
  return <img alt="Logo" src="/static/newlogo.png" width="65" height="65"/>;
};

const App = () => {
  console.log({ JobList });
  return (
    <ThemeProvider theme={theme}>
      <AppBar>
        <Toolbar>
          <Logo />
        </Toolbar>
      </AppBar>
      <JobList />
    </ThemeProvider>
  );
};

export default App;
