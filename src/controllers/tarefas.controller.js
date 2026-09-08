const tarefaModel = require("../models/tarefa.model");
const usuarioModel = require("../models/usuario.model");

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
    const { idUsuario, coluna } = req.query;
    let tarefas = tarefaModel.listar();
    let resultado = coluna
      ? tarefaModel.listarPorColuna(coluna)
      : tarefaModel.listar();

    if (idUsuario !== undefined) 
      tarefas = tarefas.filter((t) => t.idUsuario === parseInt(idUsuario));
    
    if (coluna !== undefined) 
      tarefas = tarefas.filter((t) => t.coluna === coluna);

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

    const prioridadesValidas = ["alta", "media", "baixa"];
    const colunasValidas = ["afazer", "andamento", "concluido"];
    const { texto, prioridade, coluna, idUsuario } = req.body;

    if (prioridade !== undefined && !prioridadesValidas.includes(prioridade)) {
      return res.status(400).json({ erro: "Prioridade inválida. Use 'alta', 'media' ou 'baixa'." });
    }
    if (coluna !== undefined && !colunasValidas.includes(coluna)) {
      return res.status(400).json({ erro: "Coluna inválida. Use 'afazer', 'andamento' ou 'concluido'." });
    }
    if (!texto) return res.status(400).json({ erro: "Texto obrigatório!" });

    if (idUsuario !== undefined) {
      const usuario = usuarioModel.buscar(parseInt(idUsuario));
      if (!usuario) {
        return res.status(400).json({ erro: "Usuário não encontrado" });
      }
    }
    if (
      coluna === "andamento" && idUsuario !== undefined
    ) {
      const tarefasAndamento = tarefaModel.listar().filter(t => t.idUsuario === parseInt(idUsuario) && t.coluna === "andamento");
      if (tarefasAndamento.length >= 2) {
        return res.status(400).json({ erro: "Não é possível ter mais de 2 tarefas em andamento para o mesmo usuário." });
      }
      res.status(201).json(tarefaModel.adicionar(req.body));
    }
  },

  atualizar(req, res) {    
    const {coluna, prioridade} = req.body;
    const prioridadesValidas = ["alta", "media", "baixa"];
    const colunasValidas = ["afazer", "andamento", "concluido"];
    const atualizada = tarefaModel.atualizar(parseInt(req.params.id), req.body);
    const tarefa = tarefaModel.buscar(parseInt(req.params.id));

    if (prioridade !== undefined && !prioridadesValidas.includes(prioridade)) 
      return res.status(400).json({ erro: "Prioridade inválida. Use 'alta', 'media' ou 'baixa'." });
    
    if (coluna !== undefined && !colunasValidas.includes(coluna)) 
      return res.status(400).json({ erro: "Coluna inválida. Use 'afazer', 'andamento' ou 'concluido'." });
        
    if (req.body.coluna !== undefined) {

      if (
        tarefa.coluna !== "concluido" &&
        req.body.coluna === "concluido"
      ) {
        req.body.concluidaEm = new Date().toISOString();
      }

      if (
        tarefa.coluna === "concluido" &&
        req.body.coluna !== "concluido"
      ) {
        req.body.concluidaEm = null;
      }
    }
    if (!tarefa)
      return res.status(404).json({ erro: "Tarefa não encontrada" });
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