const pool = require("../database/db");
const prisma = require("../database/prisma");
const formatarTarefa = require("../utils/formatarTarefa");

const incluirNomes = {
  projetos: { select: { nome: true } },
  usuarios: { select: { nome: true } },
  prioridades: { select: { descricao: true, cor: true } },
};

const tarefaModel = {
  listar: async () => {
    const lista = await prisma.tarefas.findMany({
      select: {
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
      orderBy: { id: "asc" },
    });

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
  contarPorProjeto: async (projetoId) => {
    const result = await pool.query(
      "SELECT COUNT(*) FROM tarefas WHERE projeto_id = $1",
      [projetoId],
    );
    return parseInt(result.rows[0].count);
  },

  // contarPorUsuario: (usuarioId) =>
  //   tarefas.filter((t) => t.usuarioId === usuarioId).length,

  // totalPorColuna: (lista) => ({
  //   afazer: lista.filter((t) => t.coluna === "afazer").length,
  //   andamento: lista.filter((t) => t.coluna === "andamento").length,
  //   concluido: lista.filter((t) => t.coluna === "concluido").length,
  // }),

  buscar: async (id) => {
    const tarefa = await prisma.tarefas.findUnique({
      where: { id: id },
      select: {
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
    });
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
    const result = await prisma.tarefas.create({
      data: {
        texto: texto,
        idprioridade: idprioridade || 2,
        coluna: coluna || "afazer",
        usuario_id: usuario_id,
        projeto_id: projeto_id,
        ordem: ordem || 0,
      },
      include: incluirNomes,
    });
    return formatarTarefa(result);
  },

  atualizar: async (id, dados) => {
    const tarefaAtual = await prisma.tarefas.findUnique({
      where: { id },
    });
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

    const tarefa = await prisma.tarefas.update({
      where: { id },
      data: {
        texto: dados.texto,
        coluna: dados.coluna,
        idprioridade: dados.idprioridade,
        usuario_id: dados.usuario_id,
        projeto_id: dados.projeto_id,
        iniciada_em: iniciadaEm,
        finalizada_em: finalizadaEm,
      },
      include: incluirNomes,
    });

    return formatarTarefa(tarefa);
  },

  remover: async (id) => {
    try {
      const tarefa = await prisma.tarefas.delete({
        where: { id: id },
      });
      return formatarTarefa(tarefa);
    } catch (erro) {
      if (erro.code === "P2025") {
        return null;
      }
      throw erro;
    }
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

module.exports = tarefaModel;
