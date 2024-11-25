const db = require("../database/config");
const bcrypt = require('bcrypt');

// Função para pegar candidatos, vai servir pra alguma situação onde a gente precise de TODOS os candidatos
const GetCandidatos = () => {
    return new Promise((resolve, reject) =>  {
        db.query('SELECT * FROM candidato', (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

// Função para pegar as vagas de uma empresa
const GetVagas = (id_empresa) => {
    return new Promise((resolve, reject) => {
        // Verifica se foi passado o id_empresa
        const query = id_empresa ? 
            'SELECT * FROM vaga WHERE id_empresa = ?' : 
            'SELECT * FROM vaga';  // Se id_empresa não for passado, retorna todas as vagas
        
        const params = id_empresa ? [id_empresa] : [];

        db.query(query, params, (err, result) => {
            if (err) {
                return reject(err);  // Rejeita a promise se houver erro
            }
            resolve(result);  // Resolve a promise com o resultado da consulta
        });
    });
}

const DeleteVagas = (id_empresa) => {
    return new Promise((resolve, reject) => {
        // Verifica se foi passado o id_empresa
        const query = 'DELETE FROM vaga WHERE id_vaga = ?';
        
        const params = id_empresa ? [id_empresa] : [];

        db.query(query, params, (err, result) => {
            if (err) {
                return reject(err);  // Rejeita a promise se houver erro
            }
            resolve(result);  // Resolve a promise com o resultado da consulta
        });
    });
}

const EditarVaga = async (id_vaga, vaga) => {
    const requiredFields = ['titulo', 'descricao', 'cidade', 'estado', 'data_fechamento', 'categoria'];
    for (const field of requiredFields) {
        if (!vaga[field]) {
            throw new Error(`Campo obrigatório faltando: ${field}`);
        }
    }

    try {
        // Verifica se o ID da vaga existe no banco de dados
        const vagaExists = await new Promise((resolve, reject) => {
            db.query('SELECT id_vaga FROM vaga WHERE id_vaga = ?', [id_vaga], (err, results) => {
                if (err) {
                    return reject(new Error(`Erro ao verificar vaga: ${err.message}`));
                }
                resolve(results.length > 0); // Retorna true se a vaga existir
            });
        });

        if (!vagaExists) {
            return {
                success: false,
                message: 'Vaga não encontrada.'
            };
        }

        // Atualiza os dados da vaga no banco de dados
        const result = await new Promise((resolve, reject) => {
            const query = `
                UPDATE vaga 
                SET titulo = ?, descricao = ?, cidade = ?, estado = ?, data_fechamento = ?, categoria = ? 
                WHERE id_vaga = ?
            `;
            const params = [vaga.titulo, vaga.descricao, vaga.cidade, vaga.estado, vaga.data_fechamento, vaga.categoria, id_vaga];
            db.query(query, params, (err, result) => {
                if (err) {
                    reject(new Error(`Erro ao atualizar vaga: ${err.message}`));
                }
                resolve(result);
            });
        });

        return {
            success: true,
            message: 'Vaga atualizada com sucesso!'
        };

    } catch (err) {
        return {
            success: false,
            message: err.message
        };
    }
};



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
                if (err) return reject(new Error(`Erro ao verificar e-mail: ${err.message}`));
                resolve(results.length > 0);
            });
        });

        if (emailExists) {
            return { success: false, message: 'Este e-mail já está cadastrado.' };
        }

        // Verifica se o CPF já existe no banco de dados
        const cpfExists = await new Promise((resolve, reject) => {
            db.query('SELECT cpf FROM candidato WHERE cpf = ?', [candidato.cpf], (err, results) => {
                if (err) return reject(new Error(`Erro ao verificar CPF: ${err.message}`));
                resolve(results.length > 0);
            });
        });

        if (cpfExists) {
            return { success: false, message: 'Este CPF já está cadastrado.' };
        }

        // Criptografa a senha antes de inserir no banco
        candidato.senha = await bcrypt.hash(candidato.senha, 10);

        // Insere o candidato
        const result = await new Promise((resolve, reject) => {
            db.query('INSERT INTO candidato SET ?', candidato, (err, result) => {
                if (err) reject(new Error(`Erro ao inserir candidato: ${err.message}`));
                resolve(result);
            });
        });

        return { success: true, id: result.insertId, message: 'Candidato adicionado com sucesso!' };

    } catch (err) {
        return { success: false, message: err.message };
    }
};

// Função para adicionar empresa com senha criptografada
const AddEmpresa = async (empresa) => {
    const requiredFields = ['nome', 'cnpj', 'telefone', 'email', 'senha'];
    for (const field of requiredFields) {
        if (!empresa[field]) {
            throw new Error(`Campo obrigatório faltando: ${field}`);
        }
    }

    try {
        const emailExists = await new Promise((resolve, reject) => {
            db.query('SELECT email FROM empresa WHERE email = ?', [empresa.email], (err, results) => {
                if (err) return reject(new Error(`Erro ao verificar e-mail: ${err.message}`));
                resolve(results.length > 0);
            });
        });

        if (emailExists) {
            return { success: false, message: 'Este e-mail já está cadastrado.' };
        }

        const cnpjExists = await new Promise((resolve, reject) => {
            db.query('SELECT cnpj FROM empresa WHERE cnpj = ?', [empresa.cnpj], (err, results) => {
                if (err) return reject(new Error(`Erro ao verificar CNPJ: ${err.message}`));
                resolve(results.length > 0);
            });
        });

        if (cnpjExists) {
            return { success: false, message: 'Este CNPJ já está cadastrado.' };
        }

        // Criptografa a senha antes de inserir no banco
        empresa.senha = await bcrypt.hash(empresa.senha, 10);

        const result = await new Promise((resolve, reject) => {
            db.query('INSERT INTO empresa SET ?', empresa, (err, result) => {
                if (err) reject(new Error(`Erro ao inserir empresa: ${err.message}`));
                resolve(result);
            });
        });

        return { success: true, id: result.insertId, message: 'Empresa adicionada com sucesso!' };

    } catch (err) {
        return { success: false, message: err.message };
    }
};

// Função para verificar o login, bem de boa, acho que aqui a gente não vai precisar fazer nenhuma mudança
const VerificaLogin = async (email, senhaFornecida) => {
    try {
        // Busca o usuário pelo email
        const user = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM candidato WHERE email = ?', [email], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(null);
                resolve(results[0]);
            });
        });

        if (!user) {
            return { success: false, message: 'Usuário não encontrado' };
        }

        // Verifica a senha
        const senhaCorreta = await bcrypt.compare(senhaFornecida, user.senha);
        console.log("Senha fornecida:", senhaFornecida);
        console.log("Senha armazenada no banco:", user.senha);
        console.log("Resultado bcrypt.compare:", senhaCorreta);
        if (!senhaCorreta) {
            return { success: false, message: 'Senha incorreta' };
        }

        return { success: true, user: user, message: 'Login bem-sucedido' };
    } catch (error) {
        return { success: false, message: `Erro ao verificar login: ${error.message}` };
    }
};

const VerificaEmpresa = async (email, senhaFornecida) => {
    try {
        // Busca a empresa pelo email
        const empresa = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM empresa WHERE email = ?', [email], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(null);
                resolve(results[0]);
            });
        });

        if (!empresa) {
            return { success: false, message: 'Empresa não encontrada' };
        }

        // Verifica a senha
        const senhaCorreta = await bcrypt.compare(senhaFornecida, empresa.senha);
        console.log("Senha fornecida:", senhaFornecida);
        console.log("Senha armazenada no banco:", empresa.senha);
        console.log("Resultado bcrypt.compare:", senhaCorreta);
        if (!senhaCorreta) {
            return { success: false, message: 'Senha incorreta' };
        }

        return { success: true, empresa: empresa, message: 'Login bem-sucedido' };
    } catch (error) {
        return { success: false, message: `Erro ao verificar login: ${error.message}` };
    }
};


const VerificaLoginAdmin = (username, password) => {
    console.log("Verificando admin com username:", username)
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM administrador WHERE email = ? AND senha = ?', [username, password], (err, result) => {
            if (err) reject(err);
            if (result.length > 0) {
                resolve(result[0]);  // Se o login for bem-sucedido, retorna os dados do candidato
            } else {
                resolve(null);  // Se falhar, retorna nulo :(
            }
        });
    });
}

const AddVaga = async (vaga) => {
    const requiredFields = ['titulo', 'descricao', 'cidade', 'estado', 'data_fechamento', 'categoria', 'id_empresa', 'data_publicacao'];
    for (const field of requiredFields) {
        if (!vaga[field]) {
            throw new Error(`Campo obrigatório faltando: ${field}`);
        }
    }

    try {
        // Verifica se o título da vaga já existe no banco de dados
        const tituloExists = await new Promise((resolve, reject) => {
            db.query('SELECT titulo FROM vaga WHERE titulo = ? AND id_empresa = ?', [vaga.titulo, vaga.id_empresa], (err, results) => {
                if (err) {
                    return reject(new Error(`Erro ao verificar título da vaga: ${err.message}`));
                }
                resolve(results.length > 0); // Retorna true se o título já existir para esta empresa
            });
        });

        if (tituloExists) {
            return {
                success: false,
                message: 'Já existe uma vaga com esse título para sua empresa.'
            };
        }

        // Inserindo a vaga no banco de dados
        const result = await new Promise((resolve, reject) => {
            db.query('INSERT INTO vaga SET ?', vaga, (err, result) => {
                if (err) {
                    reject(new Error(`Erro ao inserir vaga: ${err.message}`));
                }
                resolve(result);
            });
        });

        return {
            success: true,
            id: result.insertId,
            message: 'Vaga cadastrada com sucesso!'
        };

    } catch (err) {
        return {
            success: false,
            message: err.message
        };
    }
};

const GetVagasPorCategoria = async (categoria) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM vaga WHERE categoria = ?', [categoria], (err, result) => {
            if (err) {
                return reject(err);
            }

            resolve(result);
        });
    });
};

const GetVagaPorId = async (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM vaga WHERE id_vaga = ?', [id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result[0]); // Retorna o primeiro (e único) resultado
        });
    });
};

const AddCandidatura = async (candidatura) => {
    const { id_candidato, id_vaga } = candidatura;

    if (!id_candidato || !id_vaga) {
        throw new Error("Campos obrigatórios faltando: id_candidato ou id_vaga");
    }

    try {
        // Função auxiliar para verificar se o candidato existe e obter o currículo
        const getCandidatoInfo = async (id_candidato) => {
            return new Promise((resolve, reject) => {
                const query = "SELECT id_candidato, curriculo FROM Candidato WHERE id_candidato = ?";
                db.query(query, [id_candidato], (err, results) => {
                    if (err) return reject(new Error(`Erro ao verificar candidato: ${err.message}`));
                    resolve(results[0]); // Retorna o candidato se encontrado
                });
            });
        };

        // Função auxiliar para verificar se a vaga existe
        const checkVagaExists = async (id_vaga) => {
            return new Promise((resolve, reject) => {
                const query = "SELECT id_vaga FROM Vaga WHERE id_vaga = ?";
                db.query(query, [id_vaga], (err, results) => {
                    if (err) return reject(new Error(`Erro ao verificar vaga: ${err.message}`));
                    resolve(results.length > 0);
                });
            });
        };

        // Função auxiliar para verificar se a candidatura já existe
        const checkCandidaturaExists = async (id_candidato, id_vaga) => {
            return new Promise((resolve, reject) => {
                const query = `
                    SELECT c.id_candidatura 
                    FROM Candidatura c 
                    JOIN inscreve i ON c.id_candidatura = i.id_candidatura 
                    WHERE i.id_candidato = ? AND c.id_vaga = ?`;
                db.query(query, [id_candidato, id_vaga], (err, results) => {
                    if (err) return reject(new Error(`Erro ao verificar candidatura: ${err.message}`));
                    resolve(results[0]?.id_candidatura || null);
                });
            });
        };

        // Verifica se o candidato existe e obtém o currículo
        const candidato = await getCandidatoInfo(id_candidato);
        if (!candidato) {
            return { success: false, message: "Candidato não encontrado." };
        }

        // Verifica se a vaga existe
        const vagaExists = await checkVagaExists(id_vaga);
        if (!vagaExists) {
            return { success: false, message: "Vaga não encontrada." };
        }

        // Verifica se a candidatura já existe
        const candidaturaId = await checkCandidaturaExists(id_candidato, id_vaga);

        if (candidaturaId) {
            // Atualiza a candidatura existente
            await new Promise((resolve, reject) => {
                const query = `
                    UPDATE Candidatura 
                    SET curriculo = ?, data_candidatura = NOW(), status = ? 
                    WHERE id_candidatura = ?`;
                db.query(query, [candidato.curriculo, "em espera", candidaturaId], (err, result) => {
                    if (err) return reject(new Error(`Erro ao atualizar candidatura: ${err.message}`));
                    resolve(result);
                });
            });

            return { success: true, id: candidaturaId, message: "Candidatura atualizada com sucesso!" };
        } else {
            // Insere uma nova candidatura
            const result = await new Promise((resolve, reject) => {
                const query = `
                    INSERT INTO Candidatura (id_vaga, curriculo, data_candidatura, status) 
                    VALUES (?, ?, NOW(), ?)`;
                db.query(query, [id_vaga, candidato.curriculo, "em espera"], (err, result) => {
                    if (err) return reject(new Error(`Erro ao inserir candidatura: ${err.message}`));
                    resolve(result);
                });
            });

            // Associa o candidato à nova candidatura
            await new Promise((resolve, reject) => {
                const query = `
                    INSERT INTO inscreve (id_candidatura, id_candidato) 
                    VALUES (?, ?)`;
                db.query(query, [result.insertId, id_candidato], (err, result) => {
                    if (err) return reject(new Error(`Erro ao associar candidato à candidatura: ${err.message}`));
                    resolve(result);
                });
            });

            return { success: true, id: result.insertId, message: "Candidatura enviada com sucesso!" };
        }
    } catch (err) {
        return { success: false, message: err.message };
    }
};


//Última atualização 19/11 ---> terça-feira

//Aqui vai exportar TODAS as funções desse script
module.exports = {
    GetCandidatos,
    AddCandidato,
    VerificaLogin,
    VerificaLoginAdmin,
    AddEmpresa,
    VerificaEmpresa,
    AddVaga,
    GetVagas,
    DeleteVagas,
    EditarVaga,
    GetVagasPorCategoria,
    GetVagaPorId,
    AddCandidatura
};