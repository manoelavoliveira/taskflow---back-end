const tarefaModel = require("../models/tarefa.model");
const usuarioModel = require("../models/usuario.model");
const criarErro = require("../utils/criarErro");

const usuariosController = {

  async listar (req, res){
    // const { nome } = req.query;
    // let resultado = nome
    //   ? await usuarioModel.listarPorNome(nome)
    //   : await usuarioModel.listar();

    res.json(await usuarioModel.listar());
  },

  async buscarPorId(req, res) {
    const usuario = await usuarioModel.buscar(parseInt(req.params.id));

    if (!usuario) {
      throw criarErro(404, "Usuário não encontrado");
    }

    res.json(usuario);
  },

  async criar(req, res) {
    const { nome, email, senha_hash } = req.body;

    res.status(201).json(await usuarioModel.adicionar({ nome, email, senha_hash }));
    //  if (await usuarioModel.buscarPorEmail(email))
    //     return res.status(400).json({ erro: 'Email já cadastrado' });
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
    // res.status(201).json(await usuarioModel.adicionar({ nome, email, senha_hash }));
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
      throw criarErro(404, "Usuário não encontrado para atualizar");
    }
    
    res.json(atualizado);
  },

  async remover(req, res) {
    const id = parseInt(req.params.id);    
    // const tarefasUsuario = tarefaModel.listar().filter((t) => t.idUsuario === id);
    const removido = await usuarioModel.remover(id);

    // if ( await tarefaModel.contarPorUsuario(id) > 0)
    //   return res.status(400).json({
    //     erro: 'Usuário possui tarefas. Remova as tarefas antes de deletar o usuário.',
    //   });
    if (!removido)
      throw criarErro(404, "Usuário não encontrado para remover");

    res.json({ mensagem: "Usuário removido com sucesso", usuario: removido });
  },
};

module.exports = usuariosController;
