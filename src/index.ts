import dotenv from 'dotenv'
import fastify, { FastifyInstance } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import { ChatCompletionRequestMessage } from 'openai'

import { chatCompletionRequestMessage, querystringSchema, reqGPT035Turbo } from './schemas'
import OPEN_AI from './utils/openai'

// 使用 .env 配置
dotenv.config()

const server: FastifyInstance = fastify({ logger: true, keepAliveTimeout: 15000 })

// Demo
server.get<{
  Querystring: FromSchema<typeof querystringSchema>

  // Headers: FromSchema<typeof headersSchemaInter>
}>(
  '/demo-get',
  {
    schema: {
      querystring: querystringSchema,

      // headers: headersSchemaInter
    },
    preValidation: (request, reply, done) => {
      const { username, password } = request.query
      done(username !== 'admin' ? new Error('Must be admin') : undefined)
    },
  },
  async (request, reply) => {
    // const customerHeader = request.headers['h-Custom']
    return `logged in!`
  }
)

// 系统预设
export const GPT3_PROMPT_HEADER = `
Bessage 是一个集成闪电网络钱包、发送推文及聊天功能的应用。以下是与AI助手的对话, 只需要回答问题不需要补全对话内容。助理乐于助人、富有创意、聪明而且非常友好。
`

// gpt-3.5-turbo
server.post<{ Body: FromSchema<typeof chatCompletionRequestMessage> }>(
  '/gpt_035_turbo',
  {
    schema: {
      body: chatCompletionRequestMessage,
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
  },
  async (request, reply): Promise<void> => {
    try {
      const messages = request.body as unknown as ChatCompletionRequestMessage[] // will not throw type error
      messages.unshift({ role: 'system', content: GPT3_PROMPT_HEADER })
      const response = await OPEN_AI.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.1,
        max_tokens: 256,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      })

      console.log(response)
      if (response.status === 200) {
        response.data.choices[0].message &&
          reply.status(200).header('Content-Type', 'application/json; charset=utf-8').send({
            code: 200,
            msg: response.data.choices[0].message,
          })
      } else {
        reply.status(201).header('Content-Type', 'application/json; charset=utf-8').send({
          code: 201,
          msg: response.request.data.error.message,
        })
      }
    } catch (error) {
      console.error(error)
      reply.status(500).send({ code: 500, msg: JSON.stringify(error) })
    }
  }
)

const port = process.env.PORT as unknown as number
const host = process.env.HOST

server.listen({ port, host }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
