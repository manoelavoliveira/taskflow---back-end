// let projetos = [
//   { id: 1, nome: "Projeto 1", descricao: "Descrição 1", ativo: true },
//   { id: 2, nome: "Projeto 2", descricao: "Descrição 2", ativo: true },
//   { id: 3, nome: "Projeto 3", descricao: "Descrição 3", ativo: false },
// ];
// const ativo = true;
// let proximoIdProjeto = 4;

const pool = require("../database/db");

module.exports = {
  listar: async () => {
    const result = await pool.query("SELECT * FROM projetos");
    return result.rows;
  },
  buscar: async (id) => {
    const result = await pool.query("SELECT * FROM projetos WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  },

  adicionar: async (nome, descricao, usuario_id) => {
    const result = await pool.query(
      "INSERT INTO projetos (nome, descricao, usuario_id) VALUES ($1, $2, $3) RETURNING *",
      [nome, descricao, usuario_id],
    );
    return result.rows[0];
  },

  atualizar: async (id, nome, descricao) => {
    const result = await pool.query(
      "UPDATE projetos SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *",
      [nome, descricao, id],
    );
    return result.rows[0] || null;
  },

  remover: async (id) => {
    const result = await pool.query(
      "DELETE FROM projetos WHERE id = $1 RETURNING *",
      [id],
    );
    return result.rows[0] || null;
  },
};
