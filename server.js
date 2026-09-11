require('dotenv').config();
const express = require("express");
const app = express();
const PORTA = process.env.PORTA || 3000;
const authRoutes = require ('./src/routes/auth.routes.js')
const tarefasRoutes = require ('./src/routes/tarefas.routes');
const usuariosRoutes = require ('./src/routes/usuarios.routes.js')
const projetosRoutes = require ('./src/routes/projetos.routes.js');
const validarContentType = require('./src/middlewares/validarContentType');
const logger = require ('./src/middlewares/logger');
//const corsMiddleware = require ('./src/middlewares/cors.js');
const cors = require('cors');

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://www.google.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}));

app.use(express.json());
app.use(validarContentType);
app.use(logger);

app.get("/", (req, res) => {
  res.json({ api: "TaskFlow", versao: "1.0", status: "online" });
});


app.use('/usuarios', usuariosRoutes)
app.use('/tarefas', tarefasRoutes);
app.use('/projetos', projetosRoutes);
app.use('/auth', authRoutes);

app.use((req, res) => {
   res.status(404).json({
     erro: "Rota não encontrada",
//     metodo: req.method,
//     caminho: req.url,
   });
 });

 app.listen(PORTA, () => {
   console.log("Servidor rodando em " + PORTA);
 });
// ==============

// app.get("/tarefas", (req, res) => {
//   console.log(req.headers);
//   // console.log('baseURL:', req.host)
//   // console.log('URL:', req.url)
//   if (req.headers["tokenapi"] === "7819c74c-e58e-4981-8759-86ab43ca2a5d") {
//     res.json(tarefas);
//   } else {
//     res.status(401).json({ erro: "Acesso negado!" });
//   }
// });
//