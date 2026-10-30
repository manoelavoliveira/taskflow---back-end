const tarefas = require('./tarefas.docs');
const prioridades = require('./prioridades.docs');
const projetos = require('./projetos.docs');
const usuarios = require('./usuarios.docs');
const auth = require('./auth.docs');
const comum = require('./comum');

module.exports = {
    openapi: '3.0.3',
    info: {
        title: 'TaskFlow API ૮₍˶• . • ⑅ ₎ა',
        version: '1.0.0',
        description: 'API do TaskFlow SENAI CTGAS-ER ૮₍˶• . • ⑅ ₎ა'
    },
    servers: [{ url: 'http://localhost:3000', description: 'Local'}],
    
    security: [{bearerAuth: [] }],

    paths: {...tarefas.paths, ...projetos.paths, ...prioridades.paths, ...usuarios.paths},
    components: {
        schemas: { ...comum.schemas, ...tarefas.schemas, ...projetos.schemas, ...usuarios.schemas},
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }
        }
    }
};
