import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import App from "./App";

const { REACT_APP_BACKEND_API } = process.env;

const client = new ApolloClient({
  uri: REACT_APP_BACKEND_API,

  cache: new InMemoryCache(),
  onError: ({ graphQLErrors, networkError, reponse }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
      });
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
  }
});

ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById("root")
);
