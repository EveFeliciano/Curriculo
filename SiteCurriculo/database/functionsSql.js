const db = require("../database/config");

// Função para pegar candidatos, vai servir pra alguma situação onde a gente precise de TODOS os candidatos
const GetCandidatos = () => {
    return new Promise((resolve, reject) =>  {
        db.query('SELECT * FROM candidato', (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

//Esse aqui é pra fazer o cadastro dos candidatos. Fazendo uns testes eu vi o quanto de telas pra possíveis erros a gente vai ter que
//fazer pro site não crashar. Por exemplo, eu coloquei, sem querer, um cpf repetido, dai veio um erro gigante na tela, MUITO grande
//Por isso ia ser uma boa se a gente fizesse uma tela bonitinha pros erros.
const AddCandidato = async (candidato) => {
    const requiredFields = ['email', 'nome', 'data_nasc', 'cpf', 'telefone', 'senha'];
    for (const field of requiredFields) {
        if (!candidato[field]) {
            throw new Error(`Campo obrigatório faltando: ${field}`);
        }
    }

    try {
        // Verifica se o e-mail já existe no banco de dados
        const emailExists = await new Promise((resolve, reject) => {
            db.query('SELECT email FROM candidato WHERE email = ?', [candidato.email], (err, results) => {
                if (err) {
                    return reject(new Error(`Erro ao verificar e-mail: ${err.message}`));
                }
                resolve(results.length > 0); // Retorna true se o e-mail já existir
            });
        });

        if (emailExists) {
            return {
                success: false,
                message: 'Este e-mail já está cadastrado.'
            };
        }

        // Verifica se o CPF já existe no banco de dados
        const cpfExists = await new Promise((resolve, reject) => {
            db.query('SELECT cpf FROM candidato WHERE cpf = ?', [candidato.cpf], (err, results) => {
                if (err) {
                    return reject(new Error(`Erro ao verificar CPF: ${err.message}`));
                }
                resolve(results.length > 0); // Retorna true se o CPF já existir
            });
        });

        if (cpfExists) {
            return {
                success: false,
                message: 'Este CPF já está cadastrado.'
            };
        }

        // Agora que o CPF e o e-mail foram verificados, podemos inserir o candidato
        const result = await new Promise((resolve, reject) => {
            db.query('INSERT INTO candidato SET ?', candidato, (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return reject(new Error('Este CPF já está cadastrado.'));
                    }
                    reject(new Error(`Erro ao inserir candidato: ${err.message}`));
                }
                resolve(result);
            });
        });

        return {
            success: true,
            id: result.insertId,
            message: 'Candidato adicionado com sucesso!'
        };

    } catch (err) {
        return {
            success: false,
            message: err.message
        };
    }
};

// Função para verificar o login, bem de boa, acho que aqui a gente não vai precisar fazer nenhuma mudança
const VerificaLogin = (username, password) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM candidato WHERE nome = ? AND senha = ?', [username, password], (err, result) => {
            if (err) reject(err);
            if (result.length > 0) {
                resolve(result[0]);  // Se o login for bem-sucedido, retorna os dados do candidato
            } else {
                resolve(null);  // Se falhar, retorna nulo :(
            }
        });
    });
}

const VerificaLoginAdmin = (username, password) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM administrador WHERE nome = ? AND senha = ?', [username, password], (err, result) => {
            if (err) reject(err);
            if (result.length > 0) {
                resolve(result[0]);  // Se o login for bem-sucedido, retorna os dados do candidato
            } else {
                resolve(null);  // Se falhar, retorna nulo :(
            }
        });
    });
}

//Aqui vai ficar todo o resto de funções pro site
//Falta bastant coisa ainda
//Última atualização 05/11 ---> terça-feira

//Aqui vai exportar TODAS as funções desse script
module.exports = {
    GetCandidatos,
    AddCandidato,
    VerificaLogin,
    VerificaLoginAdmin
};
