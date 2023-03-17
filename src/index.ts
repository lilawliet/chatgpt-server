import dotenv from 'dotenv'
import fastify, { FastifyInstance } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import { ChatCompletionRequestMessage } from 'openai'

import { querystringSchema, reqGPT035Turbo } from './schemas'
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

// gpt-3.5-turbo
server.post<{ Body: FromSchema<typeof reqGPT035Turbo> }>(
  '/gpt_035_turbo',
  {
    schema: {
      body: reqGPT035Turbo,
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
      const messages = request.body.prompts as ChatCompletionRequestMessage[] // will not throw type error
      console.log(messages)
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

const PORT = 8088
const HOST = '192.168.0.105'
server.listen({ port: PORT, host: HOST }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
