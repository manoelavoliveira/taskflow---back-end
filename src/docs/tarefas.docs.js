const { json, parametroId } = require('./comum');

const paths = {
  "/tarefas": {
    get: {
      tags: ["Tarefas"],
      summary: "Lista todas as tarefas",
      responses: {
        '200': { description: "Lista de tarefas", content: json('Tarefa') },
      },
    },
  },
    "/tarefas/{id}": {
    get: {
      tags: ["Tarefas"],
      summary: "Busca uma tarefa por ID",
      parameters: [parametroId],
      responses: {
        '200': { description: "Lista de tarefas", content: json('Tarefa') },
        '400': { description: "Id inválido", content: json("Erro")},
        '401': { description: "Token ausente ou inválido", content: json("Erro")},
        '404': { description: "tarefa não encontrada", content: json("Erro")}
      },
    },
  },
};

const schemas = {
  Tarefa: {
    type: "object",
    properties: {
      id: { type: "integer", example: 1 },
      texto: { type: "string", example: "Revisar layout" },
      coluna: { type: "string", enum: ["afazer", "andamento", "concluido"] },
      iniciada_em: { type: "string", format: "date-time", nullable: true },
      finalizada_em: { type: "string", format: "date-time", nullable: true },
      usuario_id: { type: "integer", example: 1},
      projeto_id: { type: "integer", example: 1},
      idprioridade: { type: "integer", example: 1},
      ordem: { type: "integer", example: 1}
    },
  },
};

module.exports = { paths, schemas };
