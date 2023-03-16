"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const fastify_1 = __importDefault(require("fastify"));
const schemas_1 = require("./schemas");
// 使用 .env 配置
dotenv_1.default.config();
const server = (0, fastify_1.default)({ logger: true });
server.get('/demo-get', {
    schema: {
        querystring: schemas_1.querystringSchema,
        // headers: headersSchemaInter
    },
    preValidation: (request, reply, done) => {
        const { username, password } = request.query;
        done(username !== 'admin' ? new Error('Must be admin') : undefined);
    }
}, async (request, reply) => {
    // const customerHeader = request.headers['h-Custom']
    return `logged in!`;
});
server.post('/gpt-3.5-turbo', {
    schema: {
        body: schemas_1.chatCompletionRequestMessage,
        response: {
            201: {
                type: 'string',
            },
        },
    },
}, async (request, reply) => {
    /*
      request.body has type
      {
      [x: string]: unknown;
      description?: string;
      done?: boolean;
      name: string;
      }
    */
    const prompts = request.body; // will not throw type error
    reply.status(201).send();
});
const port = 8088;
server.listen({ port }, () => {
    console.log('running on: http://127.0.0.1:', port);
});
