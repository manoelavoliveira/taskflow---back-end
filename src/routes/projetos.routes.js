const express = require('express');
const router = express.Router();
const projetosController = require('../controllers/projetos.controller');

router.get('/', projetosController.listarProjeto);
router.post('/', projetosController.criarProjeto);
router.get('/:id', projetosController.buscarPorId);
router.put('/:id', projetosController.editarProjeto);
router.delete('/:id', projetosController.deletarProjeto);

module.exports = router;