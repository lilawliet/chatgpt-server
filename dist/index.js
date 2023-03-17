"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const fastify_1 = __importDefault(require("fastify"));
const schemas_1 = require("./schemas");
const openai_1 = __importDefault(require("./utils/openai"));
// 使用 .env 配置
dotenv_1.default.config();
const server = (0, fastify_1.default)({ logger: true });
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
// gpt-3.5-turbo
server.post('/gpt-3.5-turbo', {
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
                    message: response.data.choices[0].message,
                });
        }
        else {
            reply.status(201).header('Content-Type', 'application/json; charset=utf-8').send({
                code: 201,
                message: response.request.data.error.message,
            });
        }
    }
    catch (error) {
        reply.status(500).send({ code: 500, message: JSON.stringify(error) });
    }
});
// const sharedConfig = { url: process.env.REDIS_URL }
// const client = createClient(sharedConfig)
// const _createChatCompletion = async (message: string, channel: string) => {
//   try {
//     /**
//      * message: {
//      * roomID: string,
//      * messages: [{role: .., content: ..}]}
//      */
//     const _message = JSON.parse(message)
//     const roomID = _message.roomID
//     const messages = _message.messages
//     const response = await OPEN_AI.createChatCompletion({
//       model: 'gpt-3.5-turbo',
//       messages,
//       temperature: 0.1,
//       max_tokens: 256,
//       top_p: 1.0,
//       frequency_penalty: 0.0,
//       presence_penalty: 0.0,
//     })
//     if (response.status === 200) {
//       if (response.data.choices[0].message) {
//         await client.lPush(`GPT_035_RESPONSE_${roomID}`, response.data.choices[0].message as unknown as string)
//       }
//     } else {
//       console.error(response.request.data.error.message)
//     }
//   } catch (error) {
//     // reply.status(500).send(error)
//     console.error(JSON.stringify(error))
//   }
// }
const PORT = 8088;
const HOST = '0.0.0.0';
server.listen({ port: PORT, host: HOST }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
