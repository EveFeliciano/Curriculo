//Importando um monte de pacotes, se não dificulta bastante fazer o link de todos os arquivos html, js, etc.
const express = require('express');
const { VerificaLogin, AddCandidato } = require('./database/functionsSql'); 
const app = express();
const path = require('path');
app.use(express.urlencoded({ extended: true })); 
//Essa função aqui faz os css's funcionarem
app.use(express.static(path.join(__dirname, 'public')));

//IMPORTANTE: essas funções que tem "app.get" são pra fazer o link de html. Então sempre que alguém fizer um arquivo html novo 
//precisa adicionar mais uma função semelhante a essa pra fazer a conexão corretamente entre os arquivos
//Nessa função a gente tá dizendo que sempre que a rota da página for só "/", a gente vai ser levado pro index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
//Rota do login
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});
//Rota do cadastro
app.get('/cadastro', (req, res) => {
    res.sendFile(__dirname + '/cadastro.html');
});

//Nessa função a gente tá basicamente pegando os dados que são enviados pelo forms da página de login e puxando a função de verificação
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    //A funcão de verificação
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

//Essa função também pega os dados passados pelo form e adiciona a constante do tempo atual.
app.post('/cadastro', async (req, res) => {
    const { email, username, dataNasc, cpf, telefone, password } = req.body;
    //A constante do tempo atual
    const time = new Date();
    
    //Lista do que vai ser inserido na tabela
    const novoCandidato = {
        email,
        nome: username,
        data_nasc: dataNasc,
        cpf,
        telefone,
        senha: password,
        data_cadastro: time
    };

    try {
        const result = await AddCandidato(novoCandidato);
        if (result.success) {
            // Redireciona após o cadastro bem-sucedido
            res.redirect('/'); // Redireciona para a página inicial ou onde desejar
        } else {
            res.status(400).send(result.message); // Mensagem de erro
        }
    } catch (err) {
        console.error(err); // Para logar o erro no console
        res.status(500).send('Erro no servidor');
    }
});

// Inicializa o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
