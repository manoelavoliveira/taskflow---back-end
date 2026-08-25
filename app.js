const tarefasUtils = require('./utils/tarefas');

const {listarTodas, adicionar} = require('./utils/tarefas');

adicionar({id: 1, texto: 'Estudar Node', coluna: 'afazer'});
console.log(listarTodas());