const validar = require('../middlewares/validar');
const schemas = require('../middlewares/schemas');
const express = require("express");
const router = express.Router();
const tarefasController = require("../controllers/tarefas.controller");

const idValido = validar(schemas.id, 'params');

router.get("/estatisticas", tarefasController.estatisticas);

router.get("/estatisticas/resumo", tarefasController.resumo);

router.get("/", tarefasController.listar);

router.get("/:id", idValido, tarefasController.buscarPorId)

router.post("/",  validar(schemas.tarefa), tarefasController.criar)

router.put("/:id", idValido, validar(schemas.tarefa), tarefasController.atualizar);

router.delete("/:id", idValido, tarefasController.remover);

module.exports = router;
