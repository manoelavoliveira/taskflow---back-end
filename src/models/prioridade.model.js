const pool = require('../database/db');

prioridadeModel = {
  listar: async () => {
    const result = await pool.query(
      'SELECT id, descricao, ativo FROM prioridades ORDER BY id'
    );
    return result.rows;
  }}

  module.exports = prioridadeModel;