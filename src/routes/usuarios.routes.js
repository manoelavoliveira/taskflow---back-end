const express = require("express");
const router = express.Router();

let usuarios = [
  { id: 1, nome: "admin", email: "admin@gmail.com", senha: "1234" },
  { id: 2, nome: "Ana", email: "Ana@hotmail.com", senha: "ana567" },
  { id: 3, nome: "João", email: "João@outlook.com", senha: "joao890" },
  { id: 4, nome: "Maria", email: "Maria@uol.com", senha: "maria00 " },
];
let proximoIdUsuario = 5;

router.get("/", (req, res) => {
  const { nome } = req.query;
  let resultado = usuarios;

  if (nome) {
    resultado = resultado.filter((u) => u.nome === nome);
  }

  res.json(resultado);
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find((u) => u.id === id);

  if (!usuario) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }

  res.json(usuario);
});

router.post("/", (req, res) => {
  const { nome, email, senha } = req.body;
  const emailExiste = usuarios.find((u) => u.email === email);

  if (!nome || !email) return res.status(400).json({ erro: "Nome e email obrigatórios!" });

  if (emailExiste) {
    return res.status(400).json({
      erro: "Este email já está cadastrado",
    });
  }
  const novoUsuario = {
    id: proximoIdUsuario++,
    nome: nome || "",
    email: email || "",
    senha: senha || "",
  };

  usuarios.push(novoUsuario);
  res.status(201).json(novoUsuario);
});

router.put("/:id", (req, res) => {
   const id = parseInt(req.params.id);
   const {nome, email, senha } = req.body;
   const indice = usuarios.findIndex((u) => u.id === id);
   const emailExiste = usuarios.find((u) => u.email === req.body.email && u.id !== id);

   if (emailExiste) {
     return res.status(400).json({ erro: "Este email já está cadastrado" });
   }
   if (indice === -1) {
     return res.status(404).json({ erro: "Usuário não encontrado" });
   }

   const usuarioAtualizado = { id, nome, email, senha };
   usuarios[indice] = usuarioAtualizado;

   res.json(usuarioAtualizado);
 });

router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const indice = usuarios.findIndex((u) => u.id === id);

  if (indice === -1)
    return res.status(404).json({ erro: "Tarefa não encontrada" });

  const removido = usuarios.splice(indice, 1)[0];
  res.json({ mensagem: "Usuário removido com sucesso", id });
});

module.exports = router;
