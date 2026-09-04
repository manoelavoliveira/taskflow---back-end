const tarefaModel = require("../models/tarefa.model");

const tarefasController = {

  estatisticas(req, res) {
    const estatisticas = tarefaModel.estatisticas();

    res.json(estatisticas);
  },

  resumo(req, res) {
    const resumo = tarefaModel.resumo();

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

    res.json({ mensagem: "Tarefa removida com sucesso", tarefa: removida });
  },
};

module.exports = tarefasController;
