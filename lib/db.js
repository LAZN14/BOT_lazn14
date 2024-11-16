const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'face_recognition',
    password: '12345', // Укажите пароль, который вы установили
    port: 5432,
});

module.exports = { pool }; 