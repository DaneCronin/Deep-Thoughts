const express = require('express');
const path = require('path');
//import ApolloServer
const {ApolloServer} = require('apollo-server-express');
//import middleware auth function
const {authMiddleware} = require('./utils/auth');

// import typeDefs and resolvers
const {typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
//Create a new Apollo server and pass schema data into it
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Create a new instance of Apollo server with GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  //integrate our Apollo servers with the Express application as middleware
  server.applyMiddleware({app});


 //Serve up static assets
 //Check to see if Node environment is in production
 if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
 } 
//Wildcard get route to any route not defined, return production ready front-end 
 app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
 });

 //Return 404 error if no page element found
 app.get('*', (req,res) => {
  res.status(404).sendFile(path.join(__dirname, './public/404.html'));
 });

 //Once Database is open connect to Port
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);

      //log where we can go to test GQL API
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

// Call Async function to start the server
startApolloServer(typeDefs,resolvers);


