const pool = require('../database/db');
const prisma = require('../database/prisma')

prioridadeModel = {
  listar: async () => {
    const result = await prisma.prioridades.findMany({
      select: { id: true, descricao: true, ativo: true, cor: true},
      where: {ativo: true},
      orderBy: {id: 'asc'}
  });
    return result;
  }}

  module.exports = prioridadeModel;