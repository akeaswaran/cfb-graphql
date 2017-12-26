const pgp = require('pg-promise')();

const db = pgp(process.env.DATABASE_URL || 'postgres://localhost:5432/');

db.task(t => {
    return t.none('CREATE SCHEMA IF NOT EXISTS cfb_espn;')
    .then(() => {
        return t.none('CREATE TABLE IF NOT EXISTS cfb_espn.updates(id SERIAL PRIMARY KEY, retrieved_date text not null, status text not null, message text, created_at timestamp default now());')
        .then(() => {
            return t.none('CREATE TABLE IF NOT EXISTS cfb_espn.games(espn_id text not null PRIMARY KEY, retrieved_at timestamp default now(), json text);');
        })
    })
})
.then(events => {
    console.log('Table creation successful. Run `psql` to view the tables.');
})
.catch(error => {
    // error
    if (error) {
        console.log('Table creation unsuccessful. Error below.')
        console.error(error);
    }
});
