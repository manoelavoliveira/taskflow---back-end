// let tarefas = [
//   {
//     id: 1,
//     texto: "Estudar Node",
//     prioridade: "alta",
//     coluna: "afazer",
//     idUsuario: 1,
//   },
//   {
//     id: 2,
//     texto: "Estudar Back-End",
//     prioridade: "alta",
//     coluna: "andamento",
//     idUsuario: 2,
//   },
//   {
//     id: 3,
//     texto: "Testar PostMan",
//     prioridade: "media",
//     coluna: "concluido",
//     idUsuario: 3,
//   },
// ];
// let proximoId = 4;

const pool = require("../database/db");
const prisma = require("../database/prisma")

const incluirNomes = {
  projetos: {select: { nome: true }},
  usuarios: {select: { nome: true }},
  prioridades: {select: { descricao: true, cor: true }},
};

function formatarTarefa(tarefa) {
  const { projetos, usuarios, prioridades, ...resto } = tarefa;
  return {
    ...resto,
    projeto: projetos?.nome,
    usuario: usuarios?.nome,
    prioridade: prioridades?{descricao: prioridades.descricao, cor: prioridades.cor} : null 
  };
};

const tarefaModel = {
  // listar: async () => {
  //   const lista = await prisma.tarefas.findMany({
  //     include: incluirNomes,
  //     orderBy: {id: 'asc'},
  //   });
  //   return lista.map(formatarTarefa);
  // },
  listar: async () => {
    const lista = await prisma.tarefas.findMany({
      select:{
        id: true,
        texto: true,
        coluna: true,
        usuario_id: true,
        projeto_id: true,
        idprioridade: true,
        finalizada_em: true,
        iniciada_em: true,
        ordem: true,
        ...incluirNomes,
  },
      orderBy: { id: 'asc'}
  })

  return lista.map(formatarTarefa);
},

  // listarPorColuna: (coluna) => tarefas.filter((t) => t.coluna === coluna),

  // listarPorUsuario: (usuarioId) =>
  //   tarefas.filter((t) => t.usuarioId === usuarioId),

  // listarPorProjeto: (projetoId) =>
  //   tarefas.filter((t) => t.projetoId === projetoId),

  contarEmAndamentoPorUsuario: async (usuario_id, excluirid) => {
    const result = await pool.query(
      "SELECT COUNT(*) FROM tarefas WHERE usuario_id = $1 AND coluna=$2 AND id!=$3",
      [usuario_id, "andamento", excluirid],
    );
    return parseInt(result.rows[0].count);
  },
  // contarPorProjeto: (projetoId) =>
  //   tarefas.filter((t) => t.projetoId === projetoId).length,

  // contarPorUsuario: (usuarioId) =>
  //   tarefas.filter((t) => t.usuarioId === usuarioId).length,

  // totalPorColuna: (lista) => ({
  //   afazer: lista.filter((t) => t.coluna === "afazer").length,
  //   andamento: lista.filter((t) => t.coluna === "andamento").length,
  //   concluido: lista.filter((t) => t.coluna === "concluido").length,
  // }),

  buscar: async (id) => {
    const tarefa = await prisma.tarefas.findUnique({
      where: {id},
      include: incluirNomes,
    }
    );
    return tarefa ? formatarTarefa(tarefa) : null;
  },

  adicionar: async ({
    texto,
    idprioridade,
    coluna,
    usuario_id,
    projeto_id,
    ordem,
  }) => {
    const result = await pool.query(
      "INSERT INTO tarefas (texto, idprioridade, coluna, usuario_id, projeto_id, ordem) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        texto,
        idprioridade || 2,
        coluna || "afazer",
        usuario_id,
        projeto_id,
        ordem || 0,
      ],
    );
    return tarefaModel.buscar(result.rows[0].id);
  },

  atualizar: async (id, dados) => {
    const resultadoAtual = await pool.query(
      "SELECT * FROM tarefas WHERE id = $1",
      [id],
    );
    const tarefaAtual = resultadoAtual.rows[0];
    if (!tarefaAtual) return null;

    const finalizadaEm = dados.coluna === "concluido" ? new Date() : null;

    let iniciadaEm = tarefaAtual.iniciada_em;

    if (tarefaAtual.coluna === "andamento" && dados.coluna === "afazer") {
      iniciadaEm = null;
    } else if (
      tarefaAtual.coluna === "afazer" &&
      dados.coluna === "andamento"
    ) {
      iniciadaEm = new Date();
    }

    const result = await pool.query(
      `UPDATE tarefas SET 
                texto=$1,
                coluna=$2,
                usuario_id=$3,
                projeto_id=$4,
                idprioridade=$5,
                finalizada_em=$6,
                iniciada_em=$7
            WHERE id=$8 `,
      [
        dados.texto,
        dados.coluna,
        dados.usuario_id,
        dados.projeto_id,
        dados.idprioridade,
        finalizadaEm,
        iniciadaEm,
        id,
      ],
    );
    return tarefaModel.buscar(id);
  },

  remover: async (id) => {
    const result = await pool.query(
      "DELETE FROM tarefas WHERE id=$1 RETURNING *",
      [id],
    );
    return tarefaModel.buscar(result.rows[0].id) || null;
  },

  estatisticas: async (filtroColuna) => {
    const params = filtroColuna ? [filtroColuna] : [];
    const where = filtroColuna ? "WHERE coluna = $1" : "";

    const total = await pool.query(
      `SELECT COUNT(*) AS total FROM tarefas ${where}`,
      params,
    );
    const porColuna = await pool.query(
      `SELECT coluna, COUNT(*) AS total FROM tarefas ${where} GROUP BY coluna`,
      params,
    );

    const totais = { afazer: 0, andamento: 0, concluido: 0 };
    porColuna.rows.forEach((r) => {
      totais[r.coluna] = parseInt(r.total);
    });

    return {
      total: parseInt(total.rows[0].total),
      porColuna: totais,
    };
  },

  resumo: async () => {
    const contagens = await pool.query(
      "SELECT coluna, COUNT(*) AS total FROM tarefas GROUP BY coluna",
    );
    const prioridades = await pool.query(
      "SELECT prioridade, COUNT(*) AS total FROM tarefas GROUP BY prioridade ORDER BY total DESC LIMIT 1",
    );

    const totais = { afazer: 0, andamento: 0, concluido: 0 };
    let totalGeral = 0;
    contagens.rows.forEach((r) => {
      totais[r.coluna] = parseInt(r.total);
      totalGeral += parseInt(r.total);
    });

    const prioridadeDestaque = prioridades.rows[0]?.prioridade || "nenhuma";

    return (
      `Você tem ${totalGeral} tarefas. ` +
      `${totais.concluido} concluída(s), ` +
      `${totais.andamento} em andamento e ` +
      `${totais.afazer} a fazer. ` +
      `Prioridade mais comum: ${prioridadeDestaque}.`
    );
  },
};

module.exports = tarefaModel
