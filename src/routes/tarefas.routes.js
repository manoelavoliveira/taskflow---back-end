const express = require("express");
const router = express.Router();

let tarefas = [
  { id: 1, texto: "Estudar Node", prioridade: "alta", coluna: "afazer" },
  { id: 2, texto: "Estudar Back-End", prioridade: "alta", coluna: "andamento" },
  { id: 3, texto: "Testar PostMan", prioridade: "media", coluna: "concluido" },
];
let proximoId = 4;

router.get("/estatisticas", (req, res) => {
  const { coluna } = req.query;
  const base = coluna ? tarefas.filter((t) => t.coluna === coluna) : tarefas;
  const total = base.length;

  const porColuna = {
    afazer: base.filter((t) => t.coluna === "afazer").length,
    andamento: base.filter((t) => t.coluna === "andamento").length,
    concluido: base.filter((t) => t.coluna === "concluido").length,
  };

  const porPrioridade = {
    alta: base.filter((t) => t.prioridade === "alta").length,
    media: base.filter((t) => t.prioridade === "media").length,
    baixa: base.filter((t) => t.prioridade === "baixa").length,
  };

  res.json({ coluna: coluna || "todas", total, porColuna, porPrioridade });
});

router.get("/estatisticas/resumo", (req, res) => {
  const total = tarefas.length;

  const afazer = tarefas.filter((t) => t.coluna === "afazer").length;
  const andamento = tarefas.filter((t) => t.coluna === "andamento").length;
  const concluido = tarefas.filter((t) => t.coluna === "concluido").length;

  const prioridades = {
    baixa: tarefas.filter((t) => t.prioridade === "baixa").length,
    media: tarefas.filter((t) => t.prioridade === "media").length,
    alta: tarefas.filter((t) => t.prioridade === "alta").length,
  };

  const prioridadeComum = Object.entries(prioridades).sort(
    (a, b) => b[1] - a[1],
  )[0][0];
  const resumo = `Você tem ${total} tarefa(s): ${concluido} concluídas, ${andamento} em andamento e ${afazer} a fazer. Prioridade mais comum: ${prioridadeComum}`;

  res.json(resumo);
});

router.get("/", (req, res) => {
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

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const tarefa = tarefas.find((t) => t.id === id);

  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }

  res.json(tarefa);
});

router.post("/", (req, res) => {
  const { texto, prioridade, coluna, cidade } = req.body;
  if (!texto) return res.status(400).json({ erro: "Texto obrigatório!" });

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

router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  //const { texto, prioridade, coluna, cidade } = req.body;
  const indice = tarefas.findIndex((t) => t.id === id);

  if (indice === -1)
    return res.status(404).json({ erro: "Tarefa não encontrada" });

  tarefas[indice] = { ...tarefas[indice], ...req.body, id };
  //const tarefaAtualizada = { id, texto, prioridade, coluna, cidade };
  //tarefas[indice] = tarefaAtualizada;

  res.json(tarefas[indice]);
});

router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const indice = tarefas.findIndex((t) => t.id === id);

  if (indice === -1)
    return res.status(404).json({ erro: "Tarefa não encontrada" });

  const removida = tarefas.splice(indice, 1)[0];
  res.json({ mensagem: "Tarefa removida com sucesso", id });
});
module.exports = router;
