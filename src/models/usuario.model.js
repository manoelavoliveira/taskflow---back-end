const pool = require("../database/db");
const prisma = require("../database/prisma");

const incluirNomes = {
  tarefas: { select: { texto: true } },
  projetos: { select: { nome: true } },
};

function formatarUsuario(usuario) {
  const { tarefas, projetos, ...resto } = usuario;
  return {
    ...resto,
    tarefa: tarefas?.texto,
    projeto: projetos?.nome,
  };
}

module.exports = {
  listar: async () => {
    const lista = await prisma.usuarios.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
      },
      orderBy: { id: "asc" },
    });
    return lista.map(formatarUsuario);
  },

  listarPorNome: async (nome) => {
    const result = await pool.query(
      "SELECT id, nome, email FROM usuarios WHERE nome = $1",
      [nome],
    );
    return result.rows[0] || null;
  },

  buscar: async (id) => {
    const usuario = await prisma.usuarios.findUnique({
      where: { id: id },
      select: {
        id: true,
        nome: true,
        email: true,
        include: incluirNomes,
      },
    });
    return usuario ? formatarUsuario(usuario) : null;
  },

  buscarPorEmail: async (email) => {
    const result = await pool.query(
      "SELECT id, nome, senha_hash, email FROM usuarios WHERE email = $1",
      [email],
    );
    return result.rows[0] || null;
  },

  adicionar: async ({ nome, email, senha_hash }) => {
    const usuario = await prisma.usuarios.create({
      data: {
        nome: nome,
        email: email,
        senha_hash: senha_hash,
      },
    });
    return formatarUsuario(usuario);
  },

  atualizar: async (id, dados) => {
    const usuario = await prisma.usuarios.update({
      where: { id },
      data: {
        nome: dados.nome,
        email: dados.email,
        senha_hash: dados.senha_hash,
      },
    });
    return formatarUsuario(usuario);
  },

  remover: async (id) => {
    try {
      const usuario = await prisma.usuarios.delete({
        where: { id: id },
      });
      return formatarUsuario(usuario);
    } catch (erro) {
      if (erro.code === "P2025") {
        return null;
      }
      throw erro;
    }
  },
};
