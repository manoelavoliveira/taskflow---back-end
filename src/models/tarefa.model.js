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

const pool = require('../database/db');

module.exports = {
  listar: async () => {
    const result = await pool.query(
      'SELECT * FROM tarefas ORDER BY id'
    );
    return result.rows;
  },

  // listarPorColuna: (coluna) => tarefas.filter((t) => t.coluna === coluna),

  // listarPorUsuario: (usuarioId) =>
  //   tarefas.filter((t) => t.usuarioId === usuarioId),

  // listarPorProjeto: (projetoId) =>
  //   tarefas.filter((t) => t.projetoId === projetoId),

  contarEmAndamentoPorUsuario: async (usuario_id, excluirid) => {
    const result = await pool.query(
      'SELECT COUNT(*) FROM tarefas WHERE usuario_id = $1 AND coluna=$2 AND id!=$3',
      [usuario_id, 'andamento', excluirid]
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
    const result = await pool.query(
      'SELECT * FROM tarefas WHERE id = $1',[id]
    );
    return result.rows[0] || null;
   },

  adicionar: async ({texto, idprioridade, coluna, usuario_id, projeto_id, ordem}) => {
    const result = await pool.query(
      'INSERT INTO tarefas (texto, idprioridade, coluna, usuario_id, projeto_id, ordem) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [texto, idprioridade|| 2, coluna||'afazer', usuario_id, projeto_id, ordem || 0]
    );
    return result.rows[0];
  },

  atualizar: async (id, dados) => {
    const tarefaAtual = await pool.query('SELECT * FROM tarefas WHERE id = $1', [id]);
    const finalizadaEm = dados.coluna === 'concluido' ? new Date() : null;
    //let iniciadaEm = dados.coluna === 'andamento' && tarefaAtual.rows[0].iniciada_em === null ? new Date() : tarefaAtual.row[0].iniciada_em;
    // let iniciadaEm = tarefaAtual.rows[0].iniciada_em;

    // if(tarefaAtual.rows[0].coluna = 'afazer')

    
    // const {texto, idprioridade, coluna, usuario_id, concluidoEm} = dados;
    const result = await pool.query(
      'UPDATE tarefas SET texto=$1, idprioridade=$2, coluna=$3, usuario_id=$4, projeto_id=$5, finalizada_em=$6 WHERE id=$7 RETURNING *',
      [dados.texto, dados.idprioridade, dados.coluna, dados.usuario_id, dados.projeto_id, finalizadaEm, id]
    );
    return result.rows[0] || null;
  },

  remover: async (id) => {
    const result = await pool.query('DELETE FROM tarefas WHERE id=$1 RETURNING *', [id]);
    return result.rows[0] || null;
  },

  estatisticas: () => {
    const total = tarefas.length;

    const porColuna = {
      afazer: tarefas.filter((t) => t.coluna === "afazer").length,
      andamento: tarefas.filter((t) => t.coluna === "andamento").length,
      concluido: tarefas.filter((t) => t.coluna === "concluido").length,
    };

    const porPrioridade = {
      alta: tarefas.filter((t) => t.prioridade === "alta").length,
      media: tarefas.filter((t) => t.prioridade === "media").length,
      baixa: tarefas.filter((t) => t.prioridade === "baixa").length,
    };

    return { total, porColuna, porPrioridade };
  },

  resumo: () => {
    const total = tarefas.length;

    const afazer = tarefas.filter((t) => t.coluna === "afazer").length;
    const andamento = tarefas.filter((t) => t.coluna === "andamento").length;
    const concluido = tarefas.filter((t) => t.coluna === "concluido").length;

    const prioridades = {
      baixa: tarefas.filter((t) => t.prioridade === "baixa").length,
      media: tarefas.filter((t) => t.prioridade === "media").length,
      alta: tarefas.filter((t) => t.prioridade === "alta").length,
    };

    const prioridadeComum = Object.entries(prioridades).sort(
      (a, b) => b[1] - a[1],
    )[0][0];
    const resumo = `Você tem ${total} tarefa(s): ${concluido} concluídas, ${andamento} em andamento e ${afazer} a fazer. Prioridade mais comum: ${prioridadeComum}`;

    return resumo;
  },
};
