const tarefaModel = require("../models/tarefa.model");
const usuarioModel = require("../models/usuario.model");
const criarErro = require("../utils/criarErro");

//const PRIORIDADES_VALIDAS = ["alta", "media", "baixa"];
//const COLUNAS_VALIDAS = ["afazer", "andamento", "concluido"];

const tarefasController = {
  estatisticas(req, res) {
    const estatisticas = tarefaModel.estatisticas();
    // const contagemPorUsuario = todasTarefas.reduce((acumulador, tarefa) => {
    //   const id = tarefa.usuarioId;
    //   acumulador[id] = (acumulador[id] || 0) + 1;
    //   return acumulador;
    // }, {});
    // const rankingUsuarios = Object.entries(contagemPorUsuario)
    //   .map(([usuarioId, totalTarefas]) => {
    //     const usuario = usuariosModal.buscarUsuarioPorId(parseInt(usuarioId));
    //     return {
    //       usuarioId: parseInt(usuarioId),
    //       nome: usuario ? usuario.nome : "Desconhecido",
    //       totalTarefas,
    //     };
    //   })
    //   .sort((a, b) => b.totalTarefas - a.totalTarefas);

    // res.json({ estatisticas, rankingUsuarios });
    res.json({ estatisticas });
  },

  resumo(req, res) {
    const resumo = tarefaModel.resumo();

    res.json(resumo);
  },

  async listar(req, res) {
    const { usuario_id, coluna } = req.query;
    let resultado = coluna
      ? tarefaModel.listarPorColuna(coluna)
      : await tarefaModel.listar();

    res.json(resultado);
  },

  async buscarPorId(req, res) {
    const tarefa = await tarefaModel.buscar(parseInt(req.params.id));

    if (!tarefa) {
      console.log('Passei aqui');
      throw criarErro(404, "Tarefa não encontrada");
    }

    res.json(tarefa);
  },

  async criar(req, res) {
    const { texto, idprioridade, coluna, usuario_id, projeto_id, ordem } =
      req.body;

    // if (coluna && !COLUNAS_VALIDAS.includes(coluna))
    //   return res
    //     .status(400)
    //     .json({ erro: "Coluna inválida. Use: afazer, andamento ou concluido" });

    //  if (!texto) return res.status(400).json({ erro: "Texto obrigatório!" });
    // console.log(req.usuario);
    // const dados = {
    //   ...req.body,
    //   usuario_id: req.usuario.id
    // };

    // if (!usuario_id)
    //   return res.status(400).json({erro: 'O campo usuario_id é obrigatório'});
    // if (!projeto_id)
    //   return res.status(400).json({erro: 'O campo projeto_id é obrigatório'});

    if (
      coluna === "andamento" &&
      tarefaModel.contarEmAndamentoPorUsuario(parseInt(usuario_id)) >= 2
    )
      return res.status(400).json({
        erro: "Limite de 2 tarefas em andamento por usuário atingido",
      });

    res.status(201).json(await tarefaModel.adicionar(req.body));
  },

  async atualizar(req, res) {
    const { coluna, idprioridade, usuario_id } = req.body;
    const atualizada = await tarefaModel.atualizar(
      parseInt(req.params.id),
      req.body,
    );
    const tarefa = tarefaModel.buscar(parseInt(req.params.id));

    // if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade))
    //   return res
    //     .status(400)
    //     .json({ erro: "Prioridade inválida. Use: alta, media ou baixa" });

    // if (coluna && !COLUNAS_VALIDAS.includes(coluna))
    //   return res
    //     .status(400)
    //     .json({ erro: "Coluna inválida. Use: afazer, andamento ou concluido" });

    if (coluna === "andamento" && usuario_id) {
      // excluirId = id atual para não contar a própria tarefa
      if (
        tarefaModel.contarEmAndamentoPorUsuario(parseInt(usuario_id), id) >= 2
      )
        return res.status(400).json({
          erro: "Limite de 2 tarefas em andamento por usuário atingido",
        });
    }

    if (!atualizada)
      throw criarErro(404, "Tarefa não encontrada para atualizar");

    res.json(atualizada);
  },

  async remover(req, res) {
    const removida = await tarefaModel.remover(parseInt(req.params.id));

    if (!removida) 
      throw criarErro(404, "Tarefa não encontrada para remover");

    res.json({ mensagem: "Tarefa removida com sucesso", tarefa: removida });
  },
};

module.exports = tarefasController;
