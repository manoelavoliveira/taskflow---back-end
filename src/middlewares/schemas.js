const schemas = {
  id: {
    id: { obrigatorio: true, tipo: "inteiro"}
  },
  tarefa: {
    texto: { obrigatorio: true, tipo: "string", minLength: 3 },
    idprioridade: {
      obrigatorio: true,
      tipo: "inteiro",
      enum: [1, 2, 3],
    },
    coluna: {
      obrigatorio: true,
      tipo: "string",
      enum: ["afazer", "andamento", "concluido"],
    },
    usuario_id: { obrigatorio: true, tipo: "inteiro" },
    projeto_id: {obrigatorio: true, tipo: "inteiro"}
  },

  usuario: {
    nome: { obrigatorio: true, tipo: "string", minLength: 3 },
    email: { obrigatorio: true, tipo: "string", formato: "email" },
    senha_hash: { obrigatorio: true, tipo: "string", minLength: 6 },
  },

  projeto: {
    nome: { obrigatorio: true, tipo: "string" },
    descricao: { obrigatorio: false, tipo: "string" },
  },

  descricao: {
    obrigatorio: false,
    tipo: "string",
    maxLength: 200
    
  }
};

module.exports = schemas;
