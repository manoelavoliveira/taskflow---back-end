const projetoModel = require("../models/projeto.model");
const tarefaModel = require("../models/tarefa.model");
const criarErro = require("../utils/criarErro");

const projetosController = {
  async listar(req, res) {
    const { nome } = req.query;
    let resultado = await projetoModel.listar();

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

  async buscarPorId(req, res) {
    const projeto = await projetoModel.buscar(parseInt(req.params.id));

    if (!projeto) throw criarErro(404, "Projeto não encontrado");

    res.json(projeto);
  },

  async criar(req, res) {
    const { nome, descricao, usuario_id } = req.body;

    if (!nome)
      return res.status(400).json({ erro: "O nome do projeto é obrigatório!" });
    // const novoProjeto = {
    //   id: proximoIdProjeto++,
    //   nome: nome,
    //   descricao: descricao,
    //   ativo: ativo
    // };
    // projetos.push(novoProjeto);

    res.json(await projetoModel.adicionar(req.body));
  },

  async atualizar(req, res) {
    const dados = req.body;
    const atualizado = await projetoModel.atualizar(
      parseInt(req.params.id),
      dados,
    );
    if (!atualizado)
      throw criarErro(404, "Projeto não encontrado para atualizar");

    res.json(atualizado);
  },

  async remover(req, res) {
    const id = parseInt(req.params.id);

    const removido = projetoModel.remover(id);

    if (!removido)
      throw criarErro(404, "Projeto não encontrado para deletar");
    if (tarefaModel.contarPorProjeto(id) > 0)
      return res.status(400).json({
        erro: "Projeto possui tarefas associadas. Remova as tarefas antes de deletar o projeto.",
      });

    res.json({ mensagem: "Projeto removido com sucesso", projeto: removido });
  },
};

module.exports = projetosController;
