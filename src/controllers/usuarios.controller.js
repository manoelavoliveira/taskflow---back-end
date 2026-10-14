const tarefaModel = require("../models/tarefa.model");
const usuarioModel = require("../models/usuario.model");

const usuariosController = {
  async listar (req, res){
    const { nome } = req.query;
    let resultado = nome
      ? usuarioModel.listarPorNome(nome)
      : await usuarioModel.listar();

    res.json(resultado);
  },

  async buscarPorId(req, res) {
    const usuario = await usuarioModel.buscar(parseInt(req.params.id));

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json(usuario);
  },

  async criar(req, res) {
    const { nome, email, senha } = req.body;
    // if (!nome || !email || !senha) {
    //   return res
    //     .status(400)
    //     .json({ erro: "Nome, email e senha são obrigatorios" });
    // }
    // const emailExiste = await usuarioModel
    //   .listar()
    //   .find((u) => u.email === email);

    // if (emailExiste) {
    //   return res.status(400).json({ erro: "Este email já existe!" });
    // }
    res.status(201).json(await usuarioModel.adicionar(req.body));
  },

  async atualizar(req, res) {
    // const emailExiste = usuarioModel
    //   .listar()
    //   .find((u) => u.email === req.body.email);
    // if (emailExiste) {
    //   return res.status(400).json({ erro: "Esse email já está cadastrado" });
    // }
    const atualizado = await usuarioModel.atualizar(
      parseInt(req.params.id),
      req.body
    );

    if (!atualizado) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    
    res.json(atualizado);
  },

  async remover(req, res) {
    const id = parseInt(req.params.id);    
    // const tarefasUsuario = tarefaModel.listar().filter((t) => t.idUsuario === id);
    const removido = await usuarioModel.remover(parseInt(req.params.id));

    // if (tarefaModel.contarPorUsuario(id) > 0)
    //   return res.status(400).json({
    //     erro: 'Usuário possui tarefas. Remova as tarefas antes de deletar o usuário.',
    //   });
    if (!removido)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    res.json({ mensagem: "Usuário removido com sucesso", usuario: removido });
  },
};

module.exports = usuariosController;