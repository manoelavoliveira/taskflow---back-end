const express = require("express");
const app = express();
const PORTA = 3000;

let tarefas = [
  { id: 1, texto: "Estudar Node", prioridade: "alta", coluna: "afazer" },
  { id: 2, texto: "Estudar Back-End", prioridade: "alta", coluna: "andamento" },
  { id: 3, texto: "Testar PostMan", prioridade: "media", coluna: "concluido" },
];

let usuarios = [
  { id: 1, nome: "admin", email: "admin@gmail.com", senha: "1234" },
  { id: 2, nome: "Ana", email: "Ana@hotmail.com", senha: "ana567" },
  { id: 3, nome: "João", email: "João@outlook.com", senha: "joao890" },
  { id: 4, nome: "Maria", email: "Maria@uol.com", senha: "maria00 " },
  { id: 5, nome: "Maria", email: "Maria@uol.com", senha: "maria00 " },
  { id: 6, nome: "Maria", email: "Maria@uol.com", senha: "maria00 " },
];

let proximoId = 4;
let proximoIdUsuario = 7;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ api: "TaskFlow", versao: "1.0", status: "online" });
});

// ==== ESTATÍSTICAS ====
app.get("/estatisticas", (req, res) => {
  const coluna = req.query;
  let resultado = tarefas;
  const totalTarefas = tarefas.length;

  if(coluna){
    resultado = tarefas.filter(t => t.coluna === coluna);
  }

  const porColuna = {
    afazer: resultado.filter(t => t.coluna === 'afazer').length,
    andamento: resultado.filter(t => t.coluna === 'andamento').length,
    concluido: resultado.filter(t => t.coluna === 'concluido')
  }

  const porPrioridade = {
    alta: resultado.filter(t => t.prioridade === 'alta').length,
    media: resultado.filter(t => t.prioridade === 'media').length,
    baixa: resultado.filter(t => t.prioridade === 'baixa').length
  }

  const colunaComMaisTarefas = Object.entries(porColuna).sort((a, b) => b[1])[0][0];
  
  res.json({
    totalTarefas,
    porColuna,
    porPrioridade,
    'Mais tarefas': colunaComMaisTarefas
  })
})

// ==== USUARIOS ====
app.get("/usuarios/:id", (req, res) => {
  const id = Number(req.params.id);
  const usuario = usuarios.find((u) => u.id === id);

  if (!usuario) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }

  res.json(usuario);
});

app.get("/usuarios", (req, res) => {
  const { nome } = req.query;
  let resultadoUsuario = usuarios;

  if (nome) {
    resultadoUsuario = resultadoUsuario.filter((u) => u.nome === nome);
  }

  res.json(resultadoUsuario);
});

app.post("/usuarios", (req, res) => {
  const { nome, email, senha } = req.body;
  const emailExiste = usuarios.find((u) => u.email === email);

  if (emailExiste) {
    return res.status(400).json({
      erro: "Este email já está cadastrado",
    });
  }
  const novoUsuario = {
    id: proximoIdUsuario++,
    nome: nome || "",
    email: email || "",
    senha: senha || "",
  };

  usuarios.push(novoUsuario);
  res.status(201).json(novoUsuario);
});

app.put("/usuarios/:id", (req, res) => {
  const id = Number(req.params.id);
  const { nome, email, senha } = req.body;
  const indice = usuarios.findIndex((u) => u.id === id);
  const emailExiste = usuarios.find((u) => u.email === req.body.email && u.id !== id);

  if (emailExiste) {
    return res.status(400).json({ erro: "Este email já está cadastrado" });
  }
  if (indice === -1) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }

  const usuarioAtualizado = { id, nome, email, senha };
  usuarios[indice] = usuarioAtualizado;

  res.json(usuarioAtualizado);
});

app.delete("/usuarios/:id", (req, res) => {
  const id = Number(req.params.id);
  const usuario = usuarios.find((u) => u.id === id);

  if (!usuario) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }

  usuarios = usuarios.filter((u) => u.id !== id);

  res.json({ mensagem: "Usuário removido com sucesso", id });
});

// ==== TAREFAS ====

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

app.post("/tarefas", (req, res) => {
  const { texto, prioridade, coluna, cidade } = req.body;
  const novaTarefa = {
    id: proximoId++,
    texto: texto,
    prioridade: prioridade || "media",
    coluna: coluna || "afazer",
    cidade: cidade || "",
  };

  tarefas.push(novaTarefa);

  res.status(201).json(novaTarefa);
});

app.put("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);
  const { texto, prioridade, coluna, cidade } = req.body;
  const indice = tarefas.findIndex((t) => t.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }

  const tarefaAtualizada = { id, texto, prioridade, coluna, cidade };
  tarefas[indice] = tarefaAtualizada;

  res.json(tarefaAtualizada);
});

app.delete("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);
  const tarefa = tarefas.find((t) => t.id === id);

  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }

  tarefas = tarefas.filter((t) => t.id !== id);

  res.json({ mensagem: "Tarefa removida com sucesso", id });
});

app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
    metodo: req.method,
    caminho: req.url,
  });
});

app.listen(PORTA, () => {
  console.log("Servidor rodando em http://localhost:3000");
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
//

// app.get("/ok", (req, res) => {
//   res.json({ status: "ok", dados: [1, 2, 3] });
// });

// app.get("/criado", (req, res) => {
//   res.status(201).json({ mensagem: "Criado com sucesso" });
// });

// app.get("/erro", (req, res) => {
//   res.status(400).json({ erro: "Dados inválidos" });
// });

// app.get("/texto", (req, res) => {
//   res.send("Resposta em texto simples");
// });
