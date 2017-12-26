var graphql = require('graphql');
var GraphQLDate = require('graphql-scalars').GraphQLDate;
var db = require('../db');

// Define the User type
var GameType = new graphql.GraphQLObjectType({
    name: 'Game',
    description: 'A respresentation of a college football game in ESPN\'s system.',
    fields: {
        espn_id: {
            type: graphql.GraphQLString,
            description: 'The ID of the game in ESPN\'s database.'
        },
        retrieved_at: {
            type: GraphQLDate,
            description: 'When the game was retrieved from ESPN.'
        },
        json: {
            type: graphql.GraphQLString,
            description: 'The raw JSON from ESPN.'
        }
    }
});

// Define the Query type
var queryType = new graphql.GraphQLObjectType({
  name: 'GameQuery',
  description: 'A GraphQL Query object used to search the cfb-graphql PostgreSQL database.',
  fields: {
    game: {
      type: GameType,
      args: {
        id: { type: graphql.GraphQLString }
      },
      resolve:  (_, {id}) => {
          return new Promise((resolve, reject) => {
              db.select('SELECT * from cfb_espn.games WHERE espn_id = $1', [id])
              .then(result => {
                  resolve(result);
              })
              .catch(error => {
                  if (error) {
                      console.error(error);
                      reject(error);
                  }
              });
          });
      }
    }
  }
});

module.exports.schema = new graphql.GraphQLSchema({query: queryType});
