const pool = require("../database/db");
const prisma = require("../database/prisma");

const incluir = {
  tarefas: { select: { texto: true } },
  usuarios: { select: { nome: true } },
};

function formatarProjeto(projeto) {
  const { tarefas, usuarios, ...resto } = projeto;
  return {
    ...resto,
    tarefa: tarefas?.texto,
    usuario: usuarios?.nome,
  };
}

module.exports = {
  listar: async () => {
    const lista = await prisma.projetos.findMany({
      select: {
        id: true,
        nome: true,
        descricao: true,
        usuario_id: true,
        criado_em: true,
        ...incluir,
      },
      orderBy: { nome: "asc" },
    });

    return lista.map(formatarProjeto);
  },

  buscar: async (id) => {
    const projeto = await prisma.projetos.findUnique({
      where: { id: id },
      select: {
        id: true,
        nome: true,
        descricao: true,
        usuario_id: true,
        criado_em: true,
        ...incluir,
      },
    });
    return projeto ? formatarProjeto(projeto) : null;
  },

  adicionar: async ({ nome, descricao, usuario_id }) => {
    const result = await prisma.projetos.create({
      data: {
        nome: nome,
        descricao: descricao || null,
        usuario_id: usuario_id,
      },
    });
    return result;
  },

  atualizar: async (id, dados) => {
    const projetoAtual = await prisma.projetos.findUnique({
      where: { id },
    });
    if (!projetoAtual) return null;

    const projeto = await prisma.projetos.update({
      where: { id: id },
      data: {
        nome: dados.nome,
        descricao: dados.descricao,
        usuario_id: dados.usuario_id,
      },
    });
    return formatarProjeto(projeto);
  },

  remover: async (id) => {
    try {
      const projeto = await prisma.projetos.delete({
        where: { id: id },
      });
      return projeto;
    } catch (erro) {
      if (erro.code === "P2025") return null;
      throw erro;
    }
  },
};
