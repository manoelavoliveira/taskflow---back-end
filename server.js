const app = require('./app.js')

const pool = require("./src/database/db");
const PORTA = process.env.PORTA || 3000;

pool.query("SELECT NOW()", (err, res) => {
  if (err) console.error("Erro ao conectar:", err.message);
  else console.log("Banco conectado:", res.rows[0].now);
});

app.listen(PORTA, () => {
  console.log("Servidor rodando em " + PORTA);
});
