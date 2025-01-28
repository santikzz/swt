const { Client } = require('pg');

const pgClient = new Client({
    user: 'postgres_user',
    host: 'localhost',
    database: 'postgres_db',
    password: 'password!123',
    port: 5432,
});

pgClient.connect();

const createSchema = async () => {
    const query = 'CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL)';
    await pgClient.query(query);
};

module.exports = { pgClient };