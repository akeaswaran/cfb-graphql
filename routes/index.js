const GameSchema = require('../schemas/game');
const graphqlHTTP = require('express-graphql');

module.exports = (app) => {
    app.use('/games', graphqlHTTP({
        schema: GameSchema.schema,
        graphiql: true
    }));
};
