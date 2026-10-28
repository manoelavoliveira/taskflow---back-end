// let usuarios = [
//   { id: 1, nome: "admin", email: "admin@email.com", senha: "123456" },
//   { id: 2, nome: "Ana", email: "Ana@hotmail.com", senha: "ana567" },
//   { id: 3, nome: "João", email: "João@outlook.com", senha: "joao890" },
//   { id: 4, nome: "Maria", email: "Maria@uol.com", senha: "maria00" },
// ];
// let proximoIdUsuario = 5;

const pool = require('../database/db');
const prisma = require('../database/prisma')

module.exports = {
  listar: async () => {
    // const result = await pool.query(
    //   'SELECT id, nome, email FROM usuarios ORDER BY id'
    // );
    // return result.rows;

    const lista = await prisma.usuarios.findMany({
      select:{
        id: true,
        nome: true,
        email: true
      },
      orderBy: { id: 'asc'}
    })
    return lista
  },

  listarPorNome: async (nome) => {
        const result = await pool.query('SELECT id, nome, email FROM usuarios WHERE nome = $1', [nome]);
        return result.rows[0] || null;
    },

  buscar: async (id) => {
        // const result = await pool.query('SELECT id, nome, email FROM usuarios WHERE id = $1', [id]);
        // return result.rows[0] || null;
        const usuario = await prisma.usuarios.findUnique({
          where: {id: id},
          select: {
            id: true,
            nome: true,
            email: true,
          }
      });
      return usuario ? usuario : null
  },

  buscarPorEmail: async (email) => {
        const result = await pool.query('SELECT id, nome, senha_hash, email FROM usuarios WHERE email = $1', [email]);
        return result.rows[0] || null;
    },

  adicionar: async ({ nome, email, senha_hash }) => {
    const usuario = await prisma.usuarios.create({
      data: {
        nome: nome,
        email: email,
        senha_hash: senha_hash
      }
    });
    return usuario;
    //   'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email',
    //   [nome, email, senha_hash]
    // );
    // return result.rows[0];
  },
  //  const emailExiste = usuarios.find((u) => u.email === email);
  //    if (!nome || !email)
  //      return res.status(400).json({ erro: "Nome e email obrigatórios!" });

  //    if (emailExiste) {
  //      return res.status(400).json({
  //        erro: "Este email já está cadastrado",
  //      });
  //    }
  //   const novoUsuario = {
  //     id: proximoIdUsuario++,
  //     nome: nome,
  //     email: email,
  //     senha: senha,
  //   };
  //   usuarios.push(novoUsuario);
  //   return novoUsuario;

  atualizar: async (id, dados) => {
    const usuario = await prisma.usuarios.update({
      where: {id},
      data: {
        nome: dados.nome,
        email: dados.email,
        senha_hash: dados.senha_hash
      }
    });
    return usuario
    // const {nome, email, senha_hash} = dados;
    // const result = await pool.query(
    //   'UPDATE usuarios SET nome=$1, email=$2 WHERE id=$3 RETURNING id, nome, email',
    //   [dados.nome, dados.email, id]
    // );
    // return result.rows[0] || null;
  },

  remover: async (id) => {
    // const result = await pool.query('DELETE FROM usuarios WHERE id=$1 RETURNING id, nome, email', [id]);
    // return result.rows[0] || null;
    try {
      const usuario = await prisma.usuarios.delete({
        where: { id: id },
      });
      return usuario;
    } catch (erro) {
      if (erro.code === 'P2025') {
        return null
      }
      throw erro;
    }
  }
};
