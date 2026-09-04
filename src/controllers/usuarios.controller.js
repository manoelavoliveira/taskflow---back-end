const usuarioModel = require("../models/usuario.model");

const usuariosController = {
  listar(req, res) {
    const { nome } = req.query;
    let resultado = nome
      ? usuarioModel.listarPorNome(nome)
      : usuarioModel.listar();

    res.json(resultado);
  },

  buscarPorId(req, res) {
    const usuario = usuarioModel.buscar(parseInt(req.params.id));

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json(usuario);
  },

  criar(req, res) {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ erro: "Nome, email e senha são obrigatorios" });
    }
    const emailExiste = usuarioModel
      .listar()
      .find((u) => u.email === email);

    if (emailExiste) {
      return res.status(400).json({ erro: "Este email já existe!" });
    }
    res.status(201).json(usuarioModel.adicionar(req.body));
  },

  // atualizar(req, res) {
  //   const atualizado = usuarioModel.atualizar(
  //     parseInt(req.params.id),
  //     req.body,
  //   );

  //   if (!atualizado) {
  //     return res.status(404).json({ erro: "Usuário não encontrado" });
  //   }
  //   const emailExiste = usuarioModel
  //     .listar()
  //     .find((u) => u.email === req.body.email);
  //   if (emailExiste) {
  //     return res.status(400).json({ erro: "Esse email já está cadastrado" });
  //   }
  //   res.json(atualizado);
  // },

  remover(req, res) {
    const id = parseInt(req.params.id);
    const removido = usuarioModel.remover(parseInt(req.params.id));

    if (!removido)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    res.json({ mensagem: "Usuário removido com sucesso", usuario: removido });
  },
};

module.exports = usuariosController;
