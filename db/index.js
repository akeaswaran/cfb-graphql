const pgp = require('pg-promise')();

const db = pgp(process.env.DATABASE_URL || 'postgres://localhost:5432/');

module.exports = {
  query: (text, params) => {
      return db.query(text, params)
  },
  insert: (text, params) => {
      return db.none(text, params);
  },
  select: (text, params) => {
      return db.one(text, params);
  }
};
