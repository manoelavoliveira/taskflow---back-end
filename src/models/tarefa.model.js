let tarefas = [
  {
    id: 1,
    texto: "Estudar Node",
    prioridade: "alta",
    coluna: "afazer",
    idUsuario: 1,
  },
  {
    id: 2,
    texto: "Estudar Back-End",
    prioridade: "alta",
    coluna: "andamento",
    idUsuario: 2,
  },
  {
    id: 3,
    texto: "Testar PostMan",
    prioridade: "media",
    coluna: "concluido",
    idUsuario: 3,
  },
];
let proximoId = 4;

module.exports = {
  listar: () => tarefas,

  listarPorColuna: (coluna) => tarefas.filter((t) => t.coluna === coluna),

  listarPorUsuario: (usuarioId) =>
    tarefas.filter((t) => t.usuarioId === usuarioId),

  listarPorProjeto: (projetoId) =>
    tarefas.filter((t) => t.projetoId === projetoId),

  contarEmAndamentoPorUsuario: (usuarioId, excluirId) =>
    tarefas.filter(
      (t) =>
        t.usuarioId === usuarioId &&
        t.coluna === "andamento" &&
        t.id !== excluirId,
    ).length,

  contarPorProjeto: (projetoId) =>
    tarefas.filter((t) => t.projetoId === projetoId).length,

  contarPorUsuario: (usuarioId) =>
    tarefas.filter((t) => t.usuarioId === usuarioId).length,

  totalPorColuna: (lista) => ({
    afazer: lista.filter((t) => t.coluna === "afazer").length,
    andamento: lista.filter((t) => t.coluna === "andamento").length,
    concluido: lista.filter((t) => t.coluna === "concluido").length,
  }),

  buscar: (id) => tarefas.find((t) => t.id === id),

  adicionar: ({ texto, prioridade, coluna, idUsuario }) => {
    const novaTarefa = {
      id: proximoId++,
      texto: texto,
      prioridade: prioridade || "media",
      coluna: coluna || "afazer",
      idUsuario: idUsuario || null,
    };
    tarefas.push(novaTarefa);
    return novaTarefa;
  },

  atualizar: (id, dados) => {
    const idx = tarefas.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    if (dados.coluna === "concluido" && tarefas[idx].coluna !== "concluido") {
      dados.concluidaEm = new Date().toISOString();
    }
    if (dados.coluna && dados.coluna !== "concluido") {
      dados.concluidaEm = null;
    }
    tarefas[idx] = { ...tarefas[idx], ...dados, id };
    return tarefas[idx];
  },

  remover: (id) => {
    const idx = tarefas.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    return tarefas.splice(idx, 1)[0];
  },

  estatisticas: () => {
    const total = tarefas.length;

    const porColuna = {
      afazer: tarefas.filter((t) => t.coluna === "afazer").length,
      andamento: tarefas.filter((t) => t.coluna === "andamento").length,
      concluido: tarefas.filter((t) => t.coluna === "concluido").length,
    };

    const porPrioridade = {
      alta: tarefas.filter((t) => t.prioridade === "alta").length,
      media: tarefas.filter((t) => t.prioridade === "media").length,
      baixa: tarefas.filter((t) => t.prioridade === "baixa").length,
    };

    return { total, porColuna, porPrioridade };
  },

  resumo: () => {
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

    return resumo;
  },
};
