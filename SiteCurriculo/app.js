const express = require('express');
const { VerificaLogin } = require('./database/functionsSql'); 
const app = express();
const path = require('path');
app.use(express.urlencoded({ extended: true })); 

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    VerificaLogin(username, password)
        .then((user) => {
            if (user) {
                res.send('Login bem-sucedido!'); // Login bem-sucedido
            } else {
                res.send('Nome de usuário ou senha incorretos.'); // Login falhou
            }
        })
        .catch((err) => {
            res.status(500).send('Erro no servidor');
        });
});

// Inicializa o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
