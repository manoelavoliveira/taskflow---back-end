  
const prioridadeModel = require("../models/prioridade.model");
const criarErro = require("../utils/criarErro");  

const prioridadesController = {
  async listar(req, res) {
    const { descricao, ativo } = req.query;
    let resultado = 
//       ? tarefaModel.listarPorColuna(coluna)
     await prioridadeModel.listar()

    res.json(resultado)
}};

module.exports = prioridadesController;