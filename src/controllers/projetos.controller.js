const projetoModel = require("../models/projeto.model");

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
    const atualizado = projetoModel.atualizar(parseInt(req.params.id));
    if (!atualizado)
      return res.status(404).json({ erro: "Projeto não encontrado" });

    res.json(atualizado);
  },

  remover(req, res) {
    const removido = projetoModel.remover(parseInt(req.params.id));

    if (!removido)
      return res.status(404).json({ erro: "Projeto não encontrado" });

    res.json({ mensagem: "Projeto removido com sucesso", projeto: removido });
  },
};

module.exports = projetosController;
