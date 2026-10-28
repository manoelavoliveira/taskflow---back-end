// let projetos = [
//   { id: 1, nome: "Projeto 1", descricao: "Descrição 1", ativo: true },
//   { id: 2, nome: "Projeto 2", descricao: "Descrição 2", ativo: true },
//   { id: 3, nome: "Projeto 3", descricao: "Descrição 3", ativo: false },
// ];
// const ativo = true;
// let proximoIdProjeto = 4;

const pool = require("../database/db");
const prisma = require("../database/prisma")

const incluir = {
  tarefas: {select: { texto: true }},
  usuarios: {select: { nome: true }},
};

function formatarProjeto(projeto){
   const { tarefas, usuarios, ...resto } = projeto;
  return {
    ...resto,
    tarefa: tarefas?.texto,
    usuario: usuarios?.nome,
  };
};

module.exports = {
  listar: async () => {
    const lista = await prisma.projetos.findMany({
      select:{
        id: true,
        nome: true,
        descricao: true,
        usuario_id: true,
        criado_em: true,
        ...incluir,
  },
      orderBy: { nome: 'asc'}
  })

  return lista.map(formatarProjeto);
},

  buscar: async (id) => {
    const projeto = await prisma.projetos.findUnique({
      where: {id: id},
      select: {
        id: true,
        nome: true,
        descricao: true,
        usuario_id: true,
        criado_em: true,
        ...incluir
      }
    }
  );
    return projeto ? formatarProjeto(projeto) : null;
  },

  adicionar: async ({nome, descricao, usuario_id}) => {
    // const result = await pool.query(
    //   "INSERT INTO projetos (nome, descricao, usuario_id) VALUES ($1, $2, $3) RETURNING *",
    //   [nome, descricao || null, usuario_id],
    // );
    // return result.rows[0];
    const result = await prisma.projetos.create({
      data: {
        nome: nome,
        descricao: descricao || null,
        usuario_id: usuario_id
      }
    });
    return result;
  },

  atualizar: async ({id, nome, descricao}) => {
    // const result = await pool.query(
    //   "UPDATE projetos SET nome = $1, descricao = $2 WHERE usuario_id = $3 RETURNING *",
    //   [nome, descricao, usuario_id, id],
    // );
    // return result.rows[0] || null;
    const projetoAtual = await prisma.projetos.findUnique({
      where: {id}
    });
    if (!projetoAtual) return null;

    const projeto = await prisma.projetos.update({
      where: {id},
      data: {
        nome: nome,
        descricao: descricao,
        usuario_id: usuario_id
      },
    })
    return projeto;
  },

  remover: async (id) => {
    try {
      const projeto = await prisma.projetos.delete({
        where: { id: id },
      });
      return projeto;
    } catch (erro) {
      if (erro.code === 'P2025') {
        return null
      }
      throw erro;
    }
    // const result = await pool.query(
    //   "DELETE FROM projetos WHERE id = $1 RETURNING *",
    //   [id],
    // );
    // return result.rows[0] || null;
  },
};
