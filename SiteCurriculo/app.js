const express = require('express');
const db = require('./database/config')
const session = require('express-session');
const { VerificaLogin, VerificaLoginAdmin, AddCandidato, AddEmpresa, VerificaEmpresa, AddVaga, GetVagas, DeleteVagas, EditarVaga, GetVagasPorCategoria, GetVagaPorId, AddCandidatura } = require('./database/functionsSql');
const app = express();
const path = require('path');
const multer = require('multer');

// Middleware para gerenciar a sessão
app.use(session({
    secret: 'senha123',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false, // Desabilitado para desenvolvimento local sem HTTPS
        maxAge: 1000 * 60 * 60 * 24 // Sessão expira em 24 horas
    }
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
        console.log('Usuário não autenticado, redirecionando para login.');
        res.redirect('/landing-page'); // Redireciona para a página de login
    }
}

// Rota principal protegida, só acessível se o usuário estiver logado
app.get('/', checarAutenticacao, async (req, res) => {
    const tipoUsuario = req.session.tipoUsuario;
    const usuario = req.session.usuarioLogado;
    const palavraChave = req.query.keyword; // Palavra-chave da pesquisa
    console.log(palavraChave);
    
    try {
        // Buscando vagas por categoria
        const designVagas = await GetVagasPorCategoria('design');
        const marketingVagas = await GetVagasPorCategoria('marketing');
        const financesVagas = await GetVagasPorCategoria('finanças');
        const musicVagas = await GetVagasPorCategoria('música');
        const educationVagas = await GetVagasPorCategoria('educação');

        let vagas = []; // Define vagas como um array vazio por padrão
        console.log('Finances:', financesVagas);
        // Se houver uma palavra-chave, busca uma vaga correspondente
        if (palavraChave) {
            vagas = await GetVagasPorCategoria(palavraChave); 
            console.log(vagas)
        }

        // Renderiza com as vagas encontradas ou null
        if (tipoUsuario === "empresa"){
            res.render('perfilempresa', {
                usuario
            });
        }else if(tipoUsuario === "candidato"){
            res.render('index', {
                usuario,
                designVagas,
                marketingVagas,
                financesVagas,
                musicVagas,
                educationVagas,
                vagas // Passa as vagas encontradas para a página
            });
        }else{
            res.render('index', {
                usuario,
                designVagas,
                marketingVagas,
                financesVagas,
                musicVagas,
                educationVagas,
                vagas // Passa as vagas encontradas para a página
            });
        }
        
    } catch (error) {
        console.error('Erro ao buscar vagas:', error);
        res.status(500).send('Erro ao carregar as vagas.');
    }
});

// Rota de login
app.get('/login', (req, res) => {
    const error = req.query.error; // Captura o erro passado na URL
    res.sendFile(path.join(__dirname, 'telas', 'login.html'), { error });
});

app.get('/landing-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'telas', 'landing-page.html'));
});

app.get('/topics-detail/:id', checarAutenticacao, async (req, res) => {
    const idVaga = req.params.id; // Captura a ID da vaga da URL
    const usuario = req.session.usuarioLogado;
    try {
        // Buscando os detalhes da vaga pelo ID
        const vagaDetalhes = await GetVagaPorId(idVaga); // Criar essa função para buscar a vaga por ID
        
        if (vagaDetalhes) {
            res.render('topics-detail', { vaga: vagaDetalhes, usuario }); // Renderiza a página de detalhes, passando os dados da vaga
        } else {
            res.status(404).send('Vaga não encontrada');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar os detalhes da vaga.');
    }
});

app.get('/inscricoes', checarAutenticacao, async (req, res) => {
    const id_candidato = req.session.usuarioLogado.id_candidato; 
    
    if (!id_candidato) {
        return res.status(400).json({ success: false, message: 'Usuário não autenticado' });
    }

    try {
        const candidaturas = await new Promise((resolve, reject) => {
            const query = `
                SELECT Candidatura.id_candidatura, Vaga.titulo AS vaga, Candidatura.status, Candidatura.feedback
                FROM Candidatura
                JOIN Vaga ON Candidatura.id_vaga = Vaga.id_vaga
                JOIN inscreve ON Candidatura.id_candidatura = inscreve.id_candidatura
                WHERE inscreve.id_candidato = ?
            `;
            db.query(query, [id_candidato], (err, results) => {
                if (err) return reject(new Error(`Erro ao buscar candidaturas: ${err.message}`));
                resolve(results);
            });
        });

        if (candidaturas.length === 0) {
            return res.render('inscricoes', { candidaturas: [] });
        }

        // Renderiza a página com as candidaturas
        res.render('inscricoes', { candidaturas });

    } catch (error) {
        console.error('Erro ao buscar candidaturas:', error);
        return res.status(500).json({ success: false, message: 'Erro ao buscar candidaturas' });
    }
});

app.get('/vagas', async (req, res) => {
    try {
        const designVagas = await GetVagasPorCategoria('design');
        const marketingVagas = await GetVagasPorCategoria('marketing');
        const financesVagas = await GetVagasPorCategoria('finanças');
        const musicVagas = await GetVagasPorCategoria('música');
        const educationVagas = await GetVagasPorCategoria('educação');
        res.render('vagas', {
            designVagas,
            marketingVagas,
            financesVagas,
            musicVagas,
            educationVagas
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar as vagas.');
    }
});

// Função de login com persistência de sessão
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log("Tentativa de login com:", username); // Log de depuração
    console.log("Sessão inicial:", req.session); // Log da sessão antes da verificação

    VerificaLogin(username, password)
        .then((user) => {
            console.log("Resultado VerificaLogin:", user); // Log de depuração
            if (user) {
                req.session.usuarioLogado = user;
                req.session.tipoUsuario = 'candidato';
                console.log("Sessão após login candidato:", req.session);
                res.redirect('/');
            } else {
                return VerificaLoginAdmin(username, password);
            }
        })
        .then((admin) => {
            console.log("Resultado VerificaLoginAdmin:", admin); // Log de depuração
            if (admin) {
                req.session.usuarioLogado = admin;
                req.session.tipoUsuario = 'admin';
                console.log("Sessão após login admin:", req.session);
                res.redirect('/');
            } else if (admin === false || admin === null) {
                return VerificaEmpresa(username, password);
            }
        })
        .then((empresa) => {
            console.log("Resultado VerificaEmpresa:", empresa); // Log de depuração
            if (empresa) {
                req.session.usuarioLogado = empresa;
                req.session.tipoUsuario = 'empresa';
                console.log("Sessão após login empresa:", req.session);
                res.redirect('/');
            } else if (empresa === false || empresa === null) {
                const errorMsg = encodeURIComponent('Nome de usuário ou senha incorretos!');
                res.redirect(`/login?error=${errorMsg}`); // Passa o erro na URL
            }
        })
        .catch((err) => {
            console.error("Erro no servidor:", err);
            res.status(500).send('Erro no servidor');
        });
});

// Configuração do multer para salvar o arquivo no diretório 'uploads'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Diretório onde os arquivos serão salvos
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nome do arquivo único
    }
});

const upload = multer({ storage: storage });

// Rota de upload
app.post('/upload', checarAutenticacao, upload.single('curriculo'), function (req, res) {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo enviado.');
    }

    const curriculoCaminho = req.file.path; // Caminho do arquivo no servidor
    const idCandidato = req.session.usuarioLogado.id_candidato;

    // Verifique o caminho do arquivo e o ID do candidato
    console.log("Caminho do arquivo:", curriculoCaminho);
    console.log("ID do Candidato:", idCandidato);

    if (!curriculoCaminho || !idCandidato) {
        return res.status(400).send('Dados insuficientes para atualizar o currículo.');
    }

    // Atualizar o caminho do arquivo na tabela Candidato
    db.query('UPDATE Candidato SET curriculo = ? WHERE id_candidato = ?', 
    [curriculoCaminho, idCandidato], function (err, result) {
        if (err) {
            console.error("Erro ao atualizar o banco de dados:", err);
            return res.status(500).send("Erro ao atualizar o banco de dados");
        }

        // Verifique o resultado da atualização
        console.log("Resultado da atualização:", result);

        if (result.affectedRows === 0) {
            return res.status(400).send('Nenhum candidato encontrado para atualizar.');
        }

        res.render('perfil');
    });
});

app.post('/enviar-candidatura', checarAutenticacao, async (req, res) => {
    const { id_vaga, curriculo } = req.body; // Recebe os dados enviados (id_vaga e curriculo)

    // Supondo que o id_candidato vem de uma sessão ou autenticação
    const id_candidato = req.session.usuarioLogado.id_candidato; // ou qualquer outra lógica para obter o id_candidato

    if (!id_candidato || !id_vaga || !curriculo) {
        return res.status(400).json({ success: false, message: 'Campos obrigatórios faltando: id_candidato, id_vaga ou curriculo' });
    }

    const candidatura = {
        id_candidato, // ID do candidato vindo da sessão ou de outra fonte
        id_vaga,
        curriculo
    };

    try {
        // Chama a função AddCandidatura com os dados recebidos
        const result = await AddCandidatura(candidatura);

        if (result.success) {
            res.redirect('/');
        } else {
            return res.status(400).json(result); // Retorna erro com a mensagem
        }
    } catch (error) {
        console.error("Erro ao enviar candidatura:", error);
        return res.status(500).json({ success: false, message: "Erro interno ao enviar candidatura." });
    }
});

app.get('/tipo-cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'telas', 'empresa-ou-candidato.html'));
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'telas', 'cadastro.html'));
});

app.get('/cadastro-empresa', (req, res) => {
    res.sendFile(path.join(__dirname, 'telas', 'cadastro-empresa.html'));
});

// Rota de logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Erro ao sair');
        }
        res.redirect('/login');
    });
});

// Rota para a página de vagas da empresa
app.get('/vagasempresa', checarAutenticacao, async (req, res) => {
    console.log('Sessão antes da verificação em /vagasempresa:', req.session);

    if (!req.session.usuarioLogado) {
        return res.redirect('/login');
    }

    console.log('Sessão após verificação em /vagasempresa:', req.session);

    const id_empresa = req.session.usuarioLogado.id_empresa;

    try {
        const vagas = await GetVagas(id_empresa);  
        console.log("Feito.")
        res.render('vagasempresa', { vagas });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Erro ao carregar as vagas.');
    }
});

app.get('/editarvaga/:id', checarAutenticacao, async (req, res) => {
    const id_vaga = req.params.id;

    // Verifica se o usuário está logado
    if (!req.session.usuarioLogado) {
        return res.redirect('/login');
    }

    const id_empresa = req.session.usuarioLogado.id_empresa;

    try {
        // Busca os dados da vaga a partir do ID
        const vaga = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM vaga WHERE id_vaga = ? AND id_empresa = ?', [id_vaga, id_empresa], (err, results) => {
                if (err) {
                    return reject(new Error(`Erro ao buscar vaga: ${err.message}`));
                }
                resolve(results[0]); // Retorna o primeiro resultado encontrado
            });
        });

        // Verifica se a vaga existe
        if (!vaga) {
            return res.status(404).send('Vaga não encontrada');
        }

        // Renderiza o formulário de edição com os dados da vaga
        res.render('editarvaga', { vaga });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao carregar dados da vaga');
    }
});

// Rota para exibir o perfil do candidato
app.get('/perfil', checarAutenticacao, async (req, res) => {
    const idCandidato = req.session.id;
    const usuario = req.session.usuarioLogado;
    try {
      const vagas = await db.query(`
        SELECT v.titulo, v.cidade, v.data_publicacao, v.estado, v.categoria, e.nome AS empresa
        FROM Vaga v
        JOIN Empresa e ON v.id_empresa = e.id_empresa
        JOIN Candidatura c ON c.id_vaga = v.id_vaga
        JOIN inscreve i ON i.id_candidatura = c.id_candidatura  -- Verificando as candidaturas
        WHERE i.id_candidato = ?
      `, [idCandidato]);
  
      res.render('perfil', { vagas, usuario});
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao buscar vagas');
    }
});
  
// Cadastro de Candidato
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
            res.redirect('/login');
        } else {
            const errorMsg = encodeURIComponent(result.message);
            res.redirect(`/cadastro?error=${errorMsg}`); // Mensagem de erro
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
});

// Cadastro de Empresa
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
            res.redirect('/login');
        } else {
            const errorMsg = encodeURIComponent(result.message);
            res.redirect(`/cadastro-empresa?error=${errorMsg}`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
});

// Cadastro de Vaga para Empresa
app.post('/perfilempresa', checarAutenticacao, async (req, res) => {
    const { titulo, descricao, cidade, estado, data_fechamento, categoria} = req.body;
    const time = new Date();
    
    // Recupera o tipo de usuário e os dados do usuário da sessão
    const tipoUsuario = req.session.tipoUsuario;
    const usuarioLogado = req.session.usuarioLogado;

    // Verifica se o tipo de usuário é 'empresa' antes de acessar o id_empresa
    if (tipoUsuario !== 'empresa') {
        return res.status(403).send('Usuário não autenticado. Faça login como empresa.');
    }

    // Agora podemos acessar o id_empresa com segurança
    const id_empresa = usuarioLogado.id_empresa;

    // Cria o objeto com os dados da nova vaga
    const novaVaga = {
        titulo,
        descricao,
        cidade,
        estado,
        data_fechamento,
        categoria,
        id_empresa,  // O ID da empresa será o do usuário logado
        data_publicacao: time // Data de publicação da vaga
    };

    try {
        // Chama a função AddVaga que você já implementou
        const result = await AddVaga(novaVaga);
        
        if (result.success) {
            // Se a vaga for cadastrada com sucesso, redireciona para a página de vagas ou onde desejar
            res.redirect('/vagasempresa'); // Redireciona para a página de listagem de vagas
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

// Rota para deletar a vaga
app.get('/deletar-vaga/:id', checarAutenticacao, async (req, res) => {
    const id_vaga = req.params.id;

    try {
        // Chama a função DeleteVagas passando o id da vaga
        const result = await DeleteVagas(id_vaga);

        if (result.success) {
            // Se a vaga foi deletada com sucesso, redireciona para a página de vagas da empresa
            res.redirect('/vagasempresa');
        } else {
            res.redirect('/vagasempresa');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
});

app.post('/editar-vaga/:id', checarAutenticacao, async (req, res) => {
    const id_vaga = req.params.id;
    const { titulo, descricao, cidade, estado, data_fechamento, categoria } = req.body;

    // Chama a função EditarVaga passando os dados da vaga
    try {
        const result = await EditarVaga(id_vaga, { titulo, descricao, cidade, estado, data_fechamento, categoria });

        if (!result.success) {
            return res.status(400).send(result.message); // Caso não seja bem-sucedido
        }

        // Se a vaga foi atualizada com sucesso, redireciona para a lista de vagas
        res.redirect('/vagasempresa'); // Ou para qualquer página de sucesso
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao atualizar a vaga');
    }
});

// Rota para exibir os candidatos de uma vaga
app.get('/candidatos/:idVaga', checarAutenticacao, (req, res) => {
    const { idVaga } = req.params;
    const EmpresaId = req.session.usuarioLogado.id_empresa;

    // Verificar se a vaga existe e pertence à empresa logada
    db.query(`
        SELECT V.id_empresa, C.id_candidato, C.nome, Ca.curriculo, Ca.id_candidatura, Ca.status, Ca.feedback
        FROM Vaga V
        JOIN Candidatura Ca ON Ca.id_vaga = V.id_vaga
        JOIN inscreve I ON I.id_candidatura = Ca.id_candidatura
        JOIN Candidato C ON I.id_candidato = C.id_candidato
        WHERE V.id_vaga = ? AND V.id_empresa = ?;
        `, 
        [idVaga, EmpresaId], 
        (err, result) => {
            if (err) {
                console.error('Erro ao consultar o banco de dados:', err);
                return res.status(500).send('Erro ao acessar o banco de dados');
            }

            // Renderizar a página com os candidatos da vaga
            res.render('candidatos', { candidatos: result});
        }
    );
});

app.post('/atualizar-candidatura', checarAutenticacao, async (req, res) => {
    console.log(req.body);
    const { id_candidatura, status } = req.body;

    if (!id_candidatura || !status) {
        return res.status(400).json({ success: false, message: "Parâmetros obrigatórios faltando." });
    }

    try {
        // Atualiza o status e define como "respondido"
        const query = `UPDATE Candidatura 
                       SET status = ?, feedback = 'respondido'
                       WHERE id_candidatura = ?`;
        const result = await new Promise((resolve, reject) => {
            db.query(query, [status, id_candidatura], (err, result) => {
                if (err) return reject(new Error(`Erro ao atualizar candidatura: ${err.message}`));
                resolve(result);
            });
        });

        res.redirect('/vagasempresa');
    } catch (error) {
        console.error("Erro ao atualizar candidatura:", error);
        res.status(500).json({ success: false, message: "Erro interno ao atualizar candidatura." });
    }
});


// Inicializa o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

