const { json, parametroId } = require("./comum");

const paths = {
  "/prioridades": {
    get: {
      tags: ["Prioridades"],
      summary: "Lista todas as prioridades",
      responses: {
        200: { description: "Lista de prioridades", content: json("Prioridade") },
      },
    },
  }
}

module.exports = { paths };