const sql = require('mssql');

const config = {
    user: 'FaceIDUser', // или ваше имя пользователя SQL
    password: '12345',
    server: 'local', // или ваше имя сервера
    database: 'FaceRecognitionDB',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

async function connectDB() {
    try {
        await sql.connect(config);
        console.log('Connected to SQL Server');
    } catch (err) {
        console.error('Database connection failed:', err);
    }
}

module.exports = {
    connectDB,
    sql
}; 