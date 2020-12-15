import React, { useState } from "react";

import {
  Typography,
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
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
  },
  searchInput: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
}));

const JobList = () => {
  const classes = useStyles();

  const [inputText, setInputText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const { loading, error, data } = useQuery(GET_JOBS, { variables: { searchValue } });
  if (loading || (!data && !error)) {
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

  const onTextChange = (e) => {
    setInputText(e.target.value);
  };

  const clickSearch = () => {
    setSearchValue(inputText);
  };

  const { jobs } = data;
  return (
    <Container>
    <AppBar>
    <Toolbar>
      <Logo />
    </Toolbar>
    </AppBar>
    <Container className={classes.root} maxWidth={false}>
      <Grid container
            spacing={3}
            direction="row"
            justify="flex-start"
            alignItems="flex-start">
        <Grid fullWidth item key="filter" lg={12} sm={12} xl={12} xs={12}>
          <TextField
            className={classes.searchInput}
            placeholder="Программист"
            onKeyPress={e => e.key === "Enter" ? clickSearch() : null}
            label="Поиск"
            variant="outlined"
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
          <Grid item key={job.id} lg={12} sm={12} xl={12} xs={12}>
            <Card>
              <CardHeader
                title={job.title}
                subheader={job.jobDate ? job.jobDate : "сегодня"}
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
    </Container>
    </Container>
  );
};

const Logo = () => {
  return <img alt="Logo" src={`${process.env.PUBLIC_URL}/logo192.png`} width="65" height="65"/>;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <JobList />
    </ThemeProvider>
  );
};

export default App;
