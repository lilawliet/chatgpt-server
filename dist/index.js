"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPT3_PROMPT_HEADER = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fastify_1 = __importDefault(require("fastify"));
const schemas_1 = require("./schemas");
// 使用 .env 配置,要放在最前面
dotenv_1.default.config();
/**
 * 巨坑： OPEN_AI 初始化用到 process.env...., 需要在 dotenv.config() 之后执行
 */
const openai_1 = __importDefault(require("./utils/openai"));
const server = (0, fastify_1.default)({ logger: true, keepAliveTimeout: 15000 });
// server.register(cors, {
//   origin: ['*'],
// })
// Demo
server.get('/demo-get', {
    schema: {
        querystring: schemas_1.querystringSchema,
        // headers: headersSchemaInter
    },
    preValidation: (request, reply, done) => {
        const { username, password } = request.query;
        done(username !== 'admin' ? new Error('Must be admin') : undefined);
    },
}, async (request, reply) => {
    // const customerHeader = request.headers['h-Custom']
    return `logged in!`;
});
// 系统预设
exports.GPT3_PROMPT_HEADER = `
Bessage 是一个集成闪电网络钱包、发送推文及聊天功能的应用。以下是与AI助手的对话, 只需要回答问题不需要补全对话内容。助理乐于助人、富有创意、聪明而且非常友好。
`;
server.post('/test-post', {
    schema: {
        body: schemas_1.reqGPT035Turbo,
        response: {},
    },
}, async (request, reply) => {
    try {
        const messages = request.body.prompts; // will not throw type error
        messages.unshift({ role: 'system', content: exports.GPT3_PROMPT_HEADER });
        console.log('message', messages);
        reply.status(200).send({ code: 200, msg: 'ok' });
    }
    catch (error) {
        console.error(error);
        reply.status(500).send({ code: 500, msg: JSON.stringify(error) });
    }
});
// gpt-3.5-turbo
server.post('/gpt_035_turbo', {
    schema: {
        body: schemas_1.reqGPT035Turbo,
        response: {
        // 200: {
        //   code: 'integer',
        //   message: 'string',
        // },
        // 201: {
        //   code: 'integer',
        //   message: 'string',
        // },
        // 500: {
        //   code: 'integer',
        //   message: 'string',
        // },
        },
    },
}, async (request, reply) => {
    try {
        const messages = request.body.prompts; // will not throw type error
        messages.unshift({ role: 'system', content: exports.GPT3_PROMPT_HEADER });
        console.log('message', messages);
        const response = await openai_1.default.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages,
            temperature: 0.1,
            max_tokens: 256,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });
        if (response.status === 200) {
            response.data.choices[0].message &&
                reply.status(200).header('Content-Type', 'application/json; charset=utf-8').send({
                    code: 200,
                    msg: response.data.choices[0].message,
                });
        }
        else {
            reply.status(201).header('Content-Type', 'application/json; charset=utf-8').send({
                code: 201,
                msg: response.request.data.error.message,
            });
        }
    }
    catch (error) {
        console.error(error);
        reply
            .headers({
            'Access-Control-Allow-Origin': '*',
        })
            .status(500)
            .send({ code: 500, msg: JSON.stringify(error) });
    }
});
const port = process.env.PORT;
const host = process.env.HOST;
server.listen({ port, host }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
