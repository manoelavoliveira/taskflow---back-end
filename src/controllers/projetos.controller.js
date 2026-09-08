const projetoModel = require("../models/projeto.model");
const tarefaModel = require("../models/tarefa.model");

const projetosController = {
  listar(req, res) {
    const { nome, ativo } = req.query;
    let resultado = projetoModel.listar();

    // if (nome) {
    //   resultado = resultado.filter((p) => p.nome === nome);
    // };
    // if(ativo) {
    //   resultado = resultado.filter((p) => p.ativo === ativo);
    // }
    res.json(resultado);
  },

  resumo(req, res) {
    const projeto = projetoModel.buscar(parseInt(req.params.id));
    if (!projeto)
      return res.status(404).json({ erro: "Projeto não encontrado" });

    const tarefas = tarefaModel.listarPorProjeto(projeto.id);

    res.json({
      projeto,
      totalTarefas: tarefas.length,
      porColuna: tarefaModel.totalPorColuna(tarefas),
    });
  },

  buscarPorId(req, res) {
    const projeto = projetoModel.buscar(parseInt(req.params.id));

    if (!projeto) return res.status(400).json({ erro: "Projeto não existe." });

    res.json(projeto);
  },

  criar(req, res) {
    const { nome, descricao, ativo } = req.body;

    if (!nome)
      return res.status(400).json({ erro: "O nome do projeto é obrigatório!" });
    // const novoProjeto = {
    //   id: proximoIdProjeto++,
    //   nome: nome,
    //   descricao: descricao,
    //   ativo: ativo
    // };
    // projetos.push(novoProjeto);

    res.json(projetoModel.adicionar(req.body));
  },

  atualizar(req, res) {
    const dados = req.body;
    const atualizado = projetoModel.atualizar(parseInt(req.params.id), dados);
    if (!atualizado)
      return res.status(404).json({ erro: "Projeto não encontrado" });

    res.json(atualizado);
  },

  remover(req, res) {
    const removido = projetoModel.remover(parseInt(req.params.id));

    if (!removido)
      return res.status(404).json({ erro: "Projeto não encontrado" });
    if (tarefaModel.contarPorProjeto(id) > 0)
      return res.status(400).json({
        erro: "Projeto possui tarefas associadas. Remova as tarefas antes de deletar o projeto.",
      });

    res.json({ mensagem: "Projeto removido com sucesso", projeto: removido });
  },
};

module.exports = projetosController;
