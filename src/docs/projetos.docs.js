const { descricao } = require("../middlewares/schemas");
const { json, parametroId } = require("./comum");

const paths = {
  "/projetos": {
    get: {
      tags: ["Projetos"],
      summary: "Lista todos os projetos",
      responses: {
        200: { description: "Lista de projetos", content: json("Projeto") },
      },
    },
    post: {
      tags: ["Projetos"],
      summary: "Cria um projeto",
      requestBody: { required: true, content: json("Projeto") },
      responses: {
        201: { description: "Projeto criado", content: json("Projeto") },
        400: { description: "Dados inválidos", content: json("Erro") },
        401: { description: "Token ausente ou inválido", content: json("Erro") },
      },
    },
  },
  "/projetos/{id}": {
    get: {
      tags: ["Projetos"],
      summary: "Busca um projeto por ID",
      parameters: [parametroId],
      responses: {
        200: { description: "Lista de projetos", content: json("Projeto") },
        400: { description: "Id inválido", content: json("Erro") },
        401: { description: "Token ausente ou inválido", content: json("Erro") },
        404: { description: "Projeto não encontrado", content: json("Erro") },
      },
    },
    put: {
      tags: ["Projetos"],
      summary: "Atualiza um projeto",
      parameters: [parametroId],
      requestBody: { required: true, content: json("ProjetoEntrada") },
      responses: {
        200: { description: "Lista de projetos", content: json("Projeto") },
        400: { description: "Id inválido", content: json("Erro") },
        401: { description: "Token ausente ou inválido", content: json("Erro") },
        404: { description: "Projeto não encontrado", content: json("Erro") },
      },
    },
    delete: {
      tags: ["Projetos"],
      summary: "Exclui um projeto",
      parameters: [parametroId],
      responses: {
        200: { description: "Projeto excluído", 
          content: { "application/json": {schema: {
            type: "object",
            properties: {
              mensagem: { type: "string", example: "Projeto removido" },
              projeto: { $ref: "#/components/schemas/Projeto" },
          },
        }
      }
    },
  },
      401: { description: "Token ausente ou inválido", content: json("Erro") },
      404: { description: 'Projeto não encontrado', content: json('Erro') },
      }
    },
  }
}


const schemas = {
  ProjetoEntrada: {
    type: "object",
    required: ['nome', 'descricao', 'usuario_id'],
    properties: {
      id: { type: "integer", example: 1 },
      nome: { type: "string", example: "TaskFlow" },
      descricao: { type: "string", example: "Revisar layout" },
      usuario_id: { type: "integer", example: 1 }
    },
  },
  Projeto: {
    type: "object",
    required: ['nome', 'descricao', 'usuario_id'],
    properties: {
      id: { type: "integer", example: 1 },
      nome: { type: "string", example: "TaskFlow" },
      descricao: { type: "string", example: "Revisar layout" },
      usuario_id: { type: "integer", example: 1 }
    },
  },
};

module.exports = { paths, schemas };