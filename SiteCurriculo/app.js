//Importando um monte de pacotes, se não dificulta bastante fazer o link de todos os arquivos html, js, etc.
const express = require('express');
const { VerificaLogin, VerificaLoginAdmin, AddCandidato, AddEmpresa, VerificaEmpresa } = require('./database/functionsSql'); 
const app = express();
const path = require('path');
app.use(express.urlencoded({ extended: true })); 
//Essa função aqui faz os css's funcionarem
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'telas')));

//IMPORTANTE: essas funções que tem "app.get" são pra fazer o link de html. Então sempre que alguém fizer um arquivo html novo 
//precisa adicionar mais uma função semelhante a essa pra fazer a conexão corretamente entre os arquivos
//Nessa função a gente tá dizendo que sempre que a rota da página for só "/", a gente vai ser levado pro index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/telas/index.html'));
});
//Rota do login
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/telas/login.html');
});
//Rota do cadastro
app.get('/cadastro', (req, res) => {
    res.sendFile(__dirname + '/telas/cadastro.html');
});
//Rota do tipo do cadastro
app.get('/tipo-cadastro', (req, res) => {
    res.sendFile(__dirname + '/telas/empresa-ou-candidato.html');
});
app.get('/cadastro-empresa', (req, res) => {
    res.sendFile(__dirname + '/telas/cadastro-empresa.html');
});

//Nessa função a gente tá basicamente pegando os dados que são enviados pelo forms da página de login e puxando a função de verificação
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    VerificaLogin(username, password)
        .then((user) => {
            if (user) {
                res.redirect('/'); // Login bem-sucedido para usuário comum
            } else {
                // Tenta login de administrador apenas se o login de usuário comum falhar
                return VerificaLoginAdmin(username, password);
            }
        })
        .then((admin) => {
            if (admin) {
                res.redirect('/'); // Login bem-sucedido para admin
            } else if (admin === false || admin === null) {
                // Se o login de admin falhar, tenta login de empresa
                return VerificaEmpresa(username, password);
            }
        })
        .then((empresa) => {
            if (empresa) {
                res.redirect('/'); // Login bem-sucedido para empresa
            } else if (empresa === false || empresa === null) {
                // Codifique o parâmetro e redirecione para a página de login
                const errorMsg = encodeURIComponent('Nome de usuário ou senha incorretos!');
                res.redirect(`/login?error=${errorMsg}`);
            }
        })
        .catch((err) => {
            res.status(500).send('Erro no servidor');
        });
});

//Essa função também pega os dados passados pelo form e adiciona a constante do tempo atual.
app.post('/cadastro', async (req, res) => {
    const { email, username, dataNasc, cpf, telefone, password } = req.body;
    const time = new Date();
    
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
            res.redirect('/login'); // Redireciona para a página inicial ou onde desejar
        } else {
            const errorMsg = encodeURIComponent(result.message);
            res.redirect(`/cadastro?error=${errorMsg}`); // Mensagem de erro específica
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
});

app.post('/cadastro-empresa', async (req, res) => {
    const { username, cnpj, telefone, email, password } = req.body;
    const time = new Date();
    
    const novaEmpresa = {
        nome: username,
        cnpj,
        telefone,
        email,
        senha: password,
        data_cadastro: time
    };

    try {
        const result = await AddEmpresa(novaEmpresa);
        if (result.success) {
            res.redirect('/login'); // Redireciona para a página inicial ou onde desejar
        } else {
            const errorMsg = encodeURIComponent(result.message);
            res.redirect(`/cadastro-empresa?error=${errorMsg}`); // Mensagem de erro específica
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
});

// Inicializa o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
