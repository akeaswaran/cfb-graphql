const express = require('express');
const routes = require('./routes');

const app = express();
routes(app);
app.listen(4000, function() {
    console.log('Running a GraphQL API server at localhost:4000/graphql');
});
