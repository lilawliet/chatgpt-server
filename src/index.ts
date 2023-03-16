import dotenv from 'dotenv'
import fastify, { FastifyInstance } from 'fastify'
import { ChatCompletionRequestMessage } from 'openai'

import { chatCompletionRequestMessage } from './schemas'

// 使用 .env 配置
dotenv.config()

const server: FastifyInstance = fastify()

server.post<{ Body: ChatCompletionRequestMessage[] }>(
  '/gpt-3.5-turbo',
  {
    schema: {
      body: chatCompletionRequestMessage,
      response: {
        201: {
          type: 'string',
        },
      },
    },
  },
  async (request, reply): Promise<void> => {
    /*
      request.body has type
      {
      [x: string]: unknown;
      description?: string;
      done?: boolean;
      name: string;
      }
    */

    const prompts = request.body // will not throw type error

    reply.status(201).send()
  }
)

server.listen({ port: 8088 }, () => {
  console.log('running')
})
