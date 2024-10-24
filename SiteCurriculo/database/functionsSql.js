const db = require("../database/config");

// Função para pegar candidatos
const GetCandidatos = () => {
    return new Promise((resolve, reject) =>  {
        db.query('SELECT * FROM candidato', (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

// Função para adicionar um novo candidato
const AddCandidato = (candidato) => {
    return new Promise((resolve, reject) =>  {
        db.query('INSERT INTO candidato SET ?', candidato, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

// Função para verificar o login
const VerificaLogin = (username, password) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM candidato WHERE nome = ? AND senha = ?', [username, password], (err, result) => {
            if (err) reject(err);
            if (result.length > 0) {
                resolve(result[0]);  // Se o login for bem-sucedido, retorna os dados do candidato
            } else {
                resolve(null);  // Se falhar, retorna null
            }
        });
    });
}

module.exports = {
    GetCandidatos,
    AddCandidato,
    VerificaLogin
};
