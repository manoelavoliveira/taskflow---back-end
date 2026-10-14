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
      'SELECT * FROM usuarios ORDER BY id'
    );
    return result.rows;
  },

  listarPorNome: (nome) => usuarios.filter((u) => u.nome === nome),

  buscar: (id) => usuarios.find((u) => u.id === id),

  buscarPorEmail: (email) => usuarios.find(u => u.email === email),

  adicionar: async ({ nome, email, senha_hash }) => {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING *',
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
    const {nome, email, senha_hash} = dados;
    const result = await pool.query(
      'UPDATE usuarios SET nome=$1, email=$2, senha_hash=$3 WHERE id=$4 RETURNING *',
      [nome, email, senha_hash, id]
    );
    return result.rows[0] || null;
  },

  remover: async (id) => {
    const result = await pool.query('DELETE FROM usuarios WHERE id=$1 RETURNING *', [id]);
    return result.rows[0] || null;
  }
};
