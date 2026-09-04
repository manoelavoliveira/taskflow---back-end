let projetos = [
  { id: 1, nome: "Projeto 1", descricao: "Descrição 1", ativo: true },
  { id: 2, nome: "Projeto 2", descricao: "Descrição 2", ativo: true },
  { id: 3, nome: "Projeto 3", descricao: "Descrição 3", ativo: false },
];
const ativo = true;
let proximoIdProjeto = 4;

module.exports = {
  listar: () => projetos,

  buscar: (id) => projetos.find((p) => p.id === id),

  adicionar: ({ nome, descricao, ativo }) => {
    const novoProjeto = {
      id: proximoIdProjeto++,
      nome: nome,
      descricao: descricao,
      ativo: ativo,
    };
    projetos.push(novoProjeto);
    return novoProjeto;
  },

  atualizar: (id, dados) => {
    const idx = projetos.findIndex(p => p.id === id);
    if (idx === -1) return null;
    projetos[idx] = {...projetos[idx], ...dados, id};
    return tarefas[idx];
  },

  remover: (id, dados) => {
    const idx = projetos.findIndex(p => p.id === id);
    if (idx === -1) return null;
    return projetos.splice(idx, 1)
  }
};
