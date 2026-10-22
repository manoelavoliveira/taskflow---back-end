// let usuarios = [
//   { id: 1, nome: "admin", email: "admin@email.com", senha: "123456" },
//   { id: 2, nome: "Ana", email: "Ana@hotmail.com", senha: "ana567" },
//   { id: 3, nome: "João", email: "João@outlook.com", senha: "joao890" },
//   { id: 4, nome: "Maria", email: "Maria@uol.com", senha: "maria00" },
// ];
// let proximoIdUsuario = 5;

const pool = require('../database/db');

module.exports = {
  listar: async () => {
    const result = await pool.query(
      'SELECT id, nome, email FROM usuarios ORDER BY id'
    );
    return result.rows;
  },

  listarPorNome: async (nome) => {
        const result = await pool.query('SELECT id, nome, email FROM usuarios WHERE nome = $1', [nome]);
        return result.rows[0] || null;
    },

  buscar: async (id) => {
        const result = await pool.query('SELECT id, nome, email FROM usuarios WHERE id = $1', [id]);
        return result.rows[0] || null;
  },

  buscarPorEmail: async (email) => {
        const result = await pool.query('SELECT id, nome, email FROM usuarios WHERE email = $1', [email]);
        return result.rows[0] || null;
    },

  adicionar: async ({ nome, email, senha_hash }) => {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email',
      [nome, email, senha_hash]
    );
    return result.rows[0];
  },
  //  const emailExiste = usuarios.find((u) => u.email === email);
  //    if (!nome || !email)
  //      return res.status(400).json({ erro: "Nome e email obrigatórios!" });

  //    if (emailExiste) {
  //      return res.status(400).json({
  //        erro: "Este email já está cadastrado",
  //      });
  //    }
  //   const novoUsuario = {
  //     id: proximoIdUsuario++,
  //     nome: nome,
  //     email: email,
  //     senha: senha,
  //   };
  //   usuarios.push(novoUsuario);
  //   return novoUsuario;

  atualizar: async (id, dados) => {
    // const {nome, email, senha_hash} = dados;
    const result = await pool.query(
      'UPDATE usuarios SET nome=$1, email=$2 WHERE id=$3 RETURNING id, nome, email',
      [dados.nome, dados.email, id]
    );
    return result.rows[0] || null;
  },

  remover: async (id) => {
    const result = await pool.query('DELETE FROM usuarios WHERE id=$1 RETURNING id, nome, email', [id]);
    return result.rows[0] || null;
  }
};
