let projetos = [
  { id: 1, nome: 'Projeto 1', descricao: 'Descrição 1', ativo: true},
  { id: 2, nome: 'Projeto 2', descricao: 'Descrição 2', ativo: true},
  { id: 3, nome: 'Projeto 3', descricao: 'Descrição 3', ativo: false}
];
const ativo = true;
let proximoIdProjeto = 2;

const projetosController = {
  listarProjeto(req, res) {
    const { nome, ativo } = req.query;
    let resultado = projetos;

    if (nome) {
      resultado = resultado.filter((p) => p.nome === nome);
    };
    if(ativo) {
      resultado = resultado.filter((p) => p.ativo === ativo);
    }
    res.json(resultado);
  },

  buscarPorId(req, res) {
    const id = parseInt(req.params.id);
    const projeto = projetos.find((p) => p.id === id);

    if (!projeto) return res.status(400).json({ erro: "Projeto não existe." });

    res.json(projeto);
  },

  criarProjeto(req, res) {
    const { nome, descricao, ativo } = req.body;

    if (!nome)
      return res.status(400).json({ erro: "O nome do projeto é obrigatório!" });
    const novoProjeto = {
      id: proximoIdProjeto++,
      nome: nome,
      descricao: descricao,
      ativo: ativo,
    };
    projetos.push(novoProjeto);

    res.json(novoProjeto);
  },

  editarProjeto(req, res) {
    const id = parseInt(req.params.id);
    const indice = projetos.findIndex((p) => p.id === id);

    if (indice === -1)
      return res.status(404).json({ erro: "Projeto não encontrado" });

    projetos[indice] = { ...projetos[indice], ...req.body, id };

    res.json(projetos[indice]);
  },

  deletarProjeto(req, res) {
    const id = parseInt(req.params.id);
    const indice = projetos.findIndex((p) => p.id === id);

    if (indice === -1)
      return res.status(404).json({ erro: "Projeto não encontrado" });
    const removido = projetos.splice(indice, 1)[0];
    res.json({ mensagem: "Projeto removido com sucesso" });
  },
};

module.exports = projetosController;
