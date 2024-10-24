const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',  
    database: 'curriculo'
});

connection.connect((err) =>{
    if(err){throw err;}
    console.log(err);
});

module.exports = connection;