const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app.js");
const pool = require("../src/database/db");
const prisma = require("../src/database/prisma");

afterAll(async () => {
    await prisma.$disconnect();
    await pool.end();
});

const USUARIO_ID = 1;
const PROJETO_ID = 11;
const PRIORIDADE_ID = 1;

const token = jwt.sign({ id: 1, nome: "Teste" }, process.env.JWT_SECRET);

jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "error").mockImplementation(() => {});

describe('rotas da API', () => {

    test('GET / responde 200 com a mensagem da API', async () => {
        const resposta = await request(app).get('/');
        expect(resposta.status).toBe(200);
        expect(resposta.body).toEqual({ api: "TaskFlow", status: "online", versao: "1.0" });
    });

    test('rota não existente responde 404', async () => {
        const resposta = await request(app).get('/nao-existe');

        expect(resposta.status).toBe(404);
        expect(resposta.body.erro.mensagem).toBe("Rota GET /nao-existe não encontrada");
    });

    test('GET /tarefas sem token responde 401', async () => {
        const resposta = await request(app).get('/tarefas');

        expect(resposta.status).toBe(401);
    });

    test('GET /tarefas com token inválido responde 401', async () => {
        const resposta = await request(app)
            .get('/tarefas')
            .set('Authorization', 'Bearer token-invalido');
        
            expect(resposta.status).toBe(401);
    });

    test('POST /tarefas invalido responde 400', async () => {
        const resposta = await request(app)
            .post('/tarefas')
            .set('Authorization', `Bearer ${token}`)
            .send({ texto: "" });

        expect(resposta.status).toBe(400);
        expect(resposta.body.erro.mensagem).toBe("Dados inválidos");
    });

    test('POST /tarefas sem JSON responde 415', async () => {
        const resposta = await request(app)
            .post('/tarefas')
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'text/plain')
            .send("texto solto");
        
        expect(resposta.status).toBe(415);
    });

    test('GET /prioridades com token: 200 e uma lista', async () => {
        const resposta = await request(app)
            .get('/prioridades')
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.status).toBe(200);
        expect(Array.isArray(resposta.body)).toBe(true);
    });

    test('POST /tarefas cria (201) e o DELETE remove', async () => {
        const nova = {
            texto: "Tarefa criada pelo teste",
            coluna: "afazer",
            projeto_id: PROJETO_ID,            
            usuario_id: USUARIO_ID,
            idprioridade: PRIORIDADE_ID,
        };

        const criada = await request(app).post('/tarefas')
            .set('Authorization', `Bearer ${token}`).send(nova);

            expect(criada.status).toBe(201);
            expect(criada.body).toHaveProperty('id');

        const removida = await request(app).delete(`/tarefas/${criada.body.id}`)
            .set('Authorization', `Bearer ${token}`);
                
            expect(removida.status).toBe(200);
    });

    test('GET /tarefas/9999 responde 404', async () => {
        const resposta = await request(app)
            .get('/tarefas/9999')
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.status).toBe(404);
        expect(resposta.body.erro.mensagem).toBe("Tarefa não encontrada");
    });

    test('GET /tarefas com token: 200 e uma lista', async () => {
        const resposta = await request(app)
            .get('/tarefas')
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.status).toBe(200);
        expect(Array.isArray(resposta.body)).toBe(true);
    });

    test('GET /projetos com token: 200 e uma lista', async () => {
        const resposta = await request(app)
            .get('/projetos')
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.status).toBe(200);
        expect(Array.isArray(resposta.body)).toBe(true);
    });
    
});
