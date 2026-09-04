let usuarios = [
  { id: 1, nome: "admin", email: "admin@gmail.com", senha: "1234" },
  { id: 2, nome: "Ana", email: "Ana@hotmail.com", senha: "ana567" },
  { id: 3, nome: "João", email: "João@outlook.com", senha: "joao890" },
  { id: 4, nome: "Maria", email: "Maria@uol.com", senha: "maria00 " },
];
let proximoIdUsuario = 5;

module.exports = {
  listar: () => usuarios,

  listarPorNome: (nome) => usuarios.filter((u) => u.nome === nome),

  buscar: (id) => usuarios.find((u) => u.id === id),

  adicionar: ({ nome, email, senha }) => {
    // const emailExiste = usuarios.find((u) => u.email === email);
    // if (!nome || !email)
    //   return res.status(400).json({ erro: "Nome e email obrigatórios!" });

    // if (emailExiste) {
    //   return res.status(400).json({
    //     erro: "Este email já está cadastrado",
    //   });
    // }
    const novoUsuario = {
      id: proximoIdUsuario++,
      nome: nome,
      email: email,
      senha: senha,
    };
    usuarios.push(novoUsuario);
    return novoUsuario;
  },

//   atualizar: (id, dados) => {
//     const idx = usuarios.findIndex((u) => u.id === id);
//     if (idx === -1) return null;
//     usuarios[idx] = { ...usuarios[idx], ...dados, id };
//     return usuarios[idx];
//   },

  remover: (id, dados) => {
    const idx = usuarios.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    return usuarios.splice(idx, 1)[0];
  }
};
