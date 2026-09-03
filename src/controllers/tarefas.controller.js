const tarefaModel = require("../models/tarefa.model");

const tarefasController = {
  estatisticas(req, res) {
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
  },

  estatisticasResumo(req, res) {
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
  },

  listar(req, res) {
    const { coluna } = req.query;
    let resultado = coluna
      ? tarefaModel.listarPorColuna(coluna)
      : tarefaModel.listar();
    res.json(resultado);
  },

  buscarPorId(req, res) {
    const tarefa = tarefaModel.buscar(parseInt(req.params.id));

    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    res.json(tarefa);
  },

  criar(req, res) {
    const { texto } = req.body;
    if (!texto) return res.status(400).json({ erro: "Texto obrigatório!" });

    res.status(201).json(tarefaModel.adicionar(req.body));
  },

  atualizar(req, res) {
    const atualizada = tarefaModel.atualizar(parseInt(req.params.id), req.body);

    if (!atualizada)
      return res.status(404).json({ erro: "Tarefa não encontrada" });

    res.json(atualizada);
  },

  remover(req, res) {
    const removida = tarefaModel.remover(parseInt(req.params.id));
    if (!removida)
      return res.status(404).json({ erro: "Tarefa não encontrada" });

    res.json({ mensagem: "Tarefa removida com sucesso", tarefa: removida});
  },
};

module.exports = tarefasController;
