let projetos = [
    { id: 1,
    nome: TaskFlow,
    descrição: Blablabla,
    ativo: Boolean}
];
const ativo = true;
let proximoIdProjeto = 2;

const projetosController{

    listar (req, res) {
        const {nome} = req.query;
        let resultado = projetos;

        if (nome) {
            resultado = resultado.filter(p => p.nome) 
        }
        res.json(resultado)
    },

    buscarPorId (req, res) {
        const id = parseInt;

    },

    criar (req, res) {
        const novoProjeto = {
            id: proximoIdProjeto++,
            nome: "",
            descrição: "",
            ativo: "",
        }

        res.json(novoProjeto);
    },

    editar (req, res) {

    },

    deletar (req, res) {

    }
};

module.exports = projetosController;

