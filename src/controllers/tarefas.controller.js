const tarefaModel = require("../models/tarefa.model");
const usuarioModel = require("../models/usuario.model");

const PRIORIDADES_VALIDAS = ["alta", "media", "baixa"];
const COLUNAS_VALIDAS = ["afazer", "andamento", "concluido"];

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
    res.json({estatisticas})
  },

  resumo(req, res) {
    const resumo = tarefaModel.resumo();

    res.json(resumo);
  },

  listar(req, res) {
    const { idUsuario, coluna } = req.query;
    let resultado = coluna
      ? tarefaModel.listarPorColuna(coluna)
      : tarefaModel.listar();

    res.json(resultado);
  },

  buscarPorId(req, res) {
    const tarefa = tarefaModel.buscar(parseInt(req.params.id));

    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    res.json(tarefa);
  },

  criar(req, res) {
    const { texto, prioridade, coluna, idUsuario } = req.body;

    // if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade))
    //   return res
    //     .status(400)
    //     .json({ erro: "Prioridade inválida. Use: alta, media ou baixa" });

    // if (coluna && !COLUNAS_VALIDAS.includes(coluna))
    //   return res
    //     .status(400)
    //     .json({ erro: "Coluna inválida. Use: afazer, andamento ou concluido" });

    // if (!texto) return res.status(400).json({ erro: "Texto obrigatório!" });
    console.log(req.usuario);
    const dados = {
      ...req.body,
      idUsuario: req.usuario.id
    };

    if (idUsuario !== undefined) {
      const usuario = usuarioModel.buscar(parseInt(idUsuario));
      if (!usuario) {
        return res.status(400).json({ erro: "Usuário não encontrado" });
      }
    }
     if (coluna === 'andamento' &&
          tarefaModel.contarEmAndamentoPorUsuario(parseInt(idUsuario)) >= 2)
        return res.status(400).json({
          erro: 'Limite de 2 tarefas em andamento por usuário atingido',
        });
    
      res.status(201).json(tarefaModel.adicionar(dados));
  },

  atualizar(req, res) {
    const { coluna, prioridade, idUsuario } = req.body;
    const atualizada = tarefaModel.atualizar(parseInt(req.params.id), req.body);
    const tarefa = tarefaModel.buscar(parseInt(req.params.id));

    // if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade))
    //   return res
    //     .status(400)
    //     .json({ erro: "Prioridade inválida. Use: alta, media ou baixa" });

    // if (coluna && !COLUNAS_VALIDAS.includes(coluna))
    //   return res
    //     .status(400)
    //     .json({ erro: "Coluna inválida. Use: afazer, andamento ou concluido" });

    if (coluna === 'andamento' && idUsuario) {
      // excluirId = id atual para não contar a própria tarefa
      if (tarefaModel.contarEmAndamentoPorUsuario(parseInt(idUsuario), id) >= 2)
        return res.status(400).json({
          erro: 'Limite de 2 tarefas em andamento por usuário atingido',
        });
    }

    if (!atualizada)
      return res.status(404).json({ erro: "Tarefa não encontrada" });

    res.json(atualizada);
  },

  remover(req, res) {
    const removida = tarefaModel.remover(parseInt(req.params.id));

    if (!removida)
      return res.status(404).json({ erro: "Tarefa não encontrada" });

    res.json({ mensagem: "Tarefa removida com sucesso", tarefa: removida });
  },
};

module.exports = tarefasController;
