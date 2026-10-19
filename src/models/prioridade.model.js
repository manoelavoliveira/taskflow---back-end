const pool = require('../database/db');

module.exports = {
  listar: async () => {
    const result = await pool.query(
      'SELECT * FROM prioridades ORDER BY id'
    );
    return result.rows;
  }}