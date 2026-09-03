const express = require("express");
const app = express();
const PORTA = 3000;
const tarefasRoutes = require ('./src/routes/tarefas.routes');
const usuariosRoutes = require ('./src/routes/usuarios.routes.js')
const projetosRoutes = require ('./src/routes/projetos.routes.js');

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ api: "TaskFlow", versao: "1.0", status: "online" });
});

// ==== USUARIOS ====
app.use('/usuarios', usuariosRoutes)

// ==== TAREFAS ====
app.use('/tarefas', tarefasRoutes);

app.use('/projetos', projetosRoutes);

app.use((req, res) => {
   res.status(404).json({
     erro: "Rota não encontrada",
//     metodo: req.method,
//     caminho: req.url,
   });
 });

 app.listen(PORTA, () => {
   console.log("Servidor rodando em http://localhost:3000");
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