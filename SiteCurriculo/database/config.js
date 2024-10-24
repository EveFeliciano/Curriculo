const mysql = require('mysql');

//Conexão com banco de dados, galerinha
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',  
    database: 'curriculo'
});
//Isso aqui é só se tiver algum erro
connection.connect((err) =>{
    if(err){throw err;}
    console.log(err);
});
//exportando a conexão :)
module.exports = connection;