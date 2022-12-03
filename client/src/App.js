import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { setContext} from '@apollo/client/link/context';

//Import page components
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';

//Establish connection to back-end GraphQL endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

//Use setContext function as middleware to combine token from localstorage with HttpLink
const authLink = setContext((_, {headers}) => {
  //declare token variable and get it from local storage
  const token = localStorage.getItem('id_token');

  //Set HTTP request headers of every request to include the token
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}`: '',
    },
  };
});

const client = new ApolloClient({
  //combine authLink and httpLink objects so every request retrieves token and sets request headers before API call
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client = {client}>
      <Router>
    <div className='flex-column justify-flex-start min-100-vh'>
      <Header />
      <div className='container'>
        <Routes>
        <Route
         path='/' element = {<Home/>}
        />
        <Route
        path = '/login' element = {<Login/>}
        />
        <Route
        path= '/signup' element = {<Signup/>}
        />
        <Route path = '/profile'>
          <Route path = ':username' element = {<Profile/>}/>
          <Route path ='' element = {<Profile/>}/>
        </Route>

        <Route 
        path ='/thought/:id' element = {<SingleThought/>}
        />
        <Route
        path = '*' element ={<NoMatch/>}
        />

        </Routes>
      </div>
      <Footer />
    </div>
    </Router>
    </ApolloProvider>
  );
}

export default App;
