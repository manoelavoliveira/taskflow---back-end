const express = require("express");
const app = express();
const PORTA = 3000;

const tarefas = [
  { id: 1, texto: "Estudar Node", prioridade: "alta", coluna: "afazer" },
  { id: 2, texto: "Estudar Back-End", prioridade: "alta", coluna: "andamento" },
  { id: 3, texto: "Testar PostMan", prioridade: "media", coluna: "concluido" },
];

app.get("/ok", (req, res) => {
  res.json({ status: "ok", dados: [1, 2, 3] });
});

app.get("/criado", (req, res) => {
  res.status(201).json({ mensagem: "Criado com sucesso" });
});

app.get("/erro", (req, res) => {
  res.status(400).json({ erro: "Dados inválidos" });
});

app.get("/texto", (req, res) => {
  res.send("Resposta em texto simples");
});
app.get("/", (req, res) => {
  res.json({ api: "TaskFlow", versao: "1.0", status: "online" });
});

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
app.get("/usuarios", (req, res) => {
  const usuarios = [
    { id: 1, nome: "admin", email: "admin@gmail.com" },
    { id: 2, nome: "Ana", email: "Ana@hotmail.com" },
    { id: 3, nome: "João", email: "João@outlook.com" },
    { id: 4, nome: "Maria", email: "Maria@uol.com" },
  ];
  res.json(usuarios);
});

app.get("/tarefas", (req, res) => {
  const { coluna, prioridade } = req.query;
  let resultado = tarefas;

  if (coluna) {
    resultado = resultado.filter((t) => t.coluna === coluna);
  }

  if (prioridade) {
    resultado = resultado.filter((t) => t.prioridade === prioridade);
  }

  res.json(resultado);
});

app.get("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);

  const tarefa = tarefas.find((t) => t.id === id);

  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }

  res.json(tarefa);
});

app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
    metodo: req.method,
    caminho: req.url,
  });
});

app.listen(PORTA, () => {
  console.log(`Porta ${PORTA}`);
});
