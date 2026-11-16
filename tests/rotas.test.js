const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app.js");

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
});
