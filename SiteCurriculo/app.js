const express = require('express');
const session = require('express-session');
const { VerificaLogin, VerificaLoginAdmin, AddCandidato, AddEmpresa, VerificaEmpresa } = require('./database/functionsSql'); 
const app = express();
const path = require('path');

// Configuração do express-session
app.use(session({
    secret: 'senha123', // Troque por uma string segura
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Defina como true se usar HTTPS
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'telas'));
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para verificar se o usuário está logado
function checarAutenticacao(req, res, next) {
    if (req.session.usuarioLogado) {
        next(); // Usuário autenticado
    } else {
        res.redirect('/login'); // Redireciona para a página de login
    }
}

// Rota principal protegida, só acessível se o usuário estiver logado
app.get('/', checarAutenticacao, (req, res) => {
    const tipoUsuario = req.session.tipoUsuario;
    const usuario = req.session.usuarioLogado;

    if (tipoUsuario === 'candidato') {
        res.render('index', { usuario });  // Passando o objeto 'usuario' para o EJS
    } else if (tipoUsuario === 'empresa') {
        res.render('perfilempresa', { usuario });
    } else if (tipoUsuario === 'admin') {
        res.render('index', { usuario });
    } else {
        res.redirect('/login'); // Caso não esteja logado ou tipo inválido
    }
});

// Rota de login
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/telas/login.html');
});

// Rota de cadastro
app.get('/cadastro', (req, res) => {
    res.sendFile(__dirname + '/telas/cadastro.html');
});

app.get('/tipo-cadastro', (req, res) => {
    res.sendFile(__dirname + '/telas/empresa-ou-candidato.html');
});

app.get('/cadastro-empresa', (req, res) => {
    res.sendFile(__dirname + '/telas/cadastro-empresa.html');
});

app.get('/perfilempresa', (req, res) => {
    res.sendFile(__dirname + '/telas/perfilempresa.ejs');
});

// Função de login com persistência de sessão
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    VerificaLogin(username, password)
        .then((user) => {
            if (user) {
                req.session.usuarioLogado = user; // Salva o usuário na sessão
                req.session.tipoUsuario = 'candidato'; // Define como candidato
                res.redirect('/'); // Redireciona para a página principal
            } else {
                return VerificaLoginAdmin(username, password);
            }
        })
        .then((admin) => {
            if (admin) {
                req.session.usuarioLogado = admin; // Salva o admin na sessão
                req.session.tipoUsuario = 'admin'; // Define como admin
                res.redirect('/'); // Redireciona para a página principal
            } else if (admin === false || admin === null) {
                return VerificaEmpresa(username, password);
            }
        })
        .then((empresa) => {
            if (empresa) {
                req.session.usuarioLogado = empresa; // Salva a empresa na sessão
                req.session.tipoUsuario = 'empresa'; // Define como empresa
                res.redirect('/'); // Redireciona para a página principal
            } else if (empresa === false || empresa === null) {
                const errorMsg = encodeURIComponent('Nome de usuário ou senha incorretos!');
                res.redirect(`/login?error=${errorMsg}`);
            }
        })
        .catch((err) => {
            res.status(500).send('Erro no servidor');
        });
});


// Função de logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Erro ao sair');
        }
        res.redirect('/login');
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

app.post('/perfilempresa', async (req, res) => {
    const { titulo, descricao, cidade, estado, data_fechamento, categoria, requisitos } = req.body;
    const time = new Date();
    
    // Recupera o id_empresa da sessão (deve estar armazenado na sessão após o login da empresa)
    const id_empresa = req.session.id_empresa;

    // Verifica se o id_empresa está presente na sessão
    if (!id_empresa) {
        return res.status(403).send('Usuário não autenticado. Faça login como empresa.');
    }

    // Cria o objeto com os dados da nova vaga
    const novaVaga = {
        titulo,
        descricao,
        cidade,
        estado,
        data_fechamento,
        categoria,
        requisitos,
        id_empresa,  // O ID da empresa será o do usuário logado
        data_publicacao: time // Data de publicação da vaga
    };

    try {
        // Chama a função AddVaga que você já implementou
        const result = await AddVaga(novaVaga);
        
        if (result.success) {
            // Se a vaga for cadastrada com sucesso, redireciona para a página de vagas ou onde desejar
            res.send('Vaga Adicionada'); // Redireciona para a página de listagem de vagas
        } else {
            // Caso haja erro, exibe a mensagem de erro na URL
            const errorMsg = encodeURIComponent(result.message);
            res.redirect(`/perfilempresa?error=${errorMsg}`); // Redireciona para a página de cadastro com a mensagem de erro
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor'); // Caso ocorra erro no servidor
    }
});


// Inicializa o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
