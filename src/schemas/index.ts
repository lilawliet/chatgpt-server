import { asConst } from 'json-schema-to-ts'

export type Role = 'system' | 'user' | 'assistant'

// gpt3.5
const role = asConst({ enum: ['system', 'user', 'assistant'] })
export const chatCompletionRequestMessage = asConst({
  type: 'object',
  properties: {
    role: role,
    content: { type: 'string' },
  },
  required: ['role', 'content'],
})

export const reqGPT035Turbo = {
  type: 'object',
  properties: {
    prompts: { type: 'array', items: chatCompletionRequestMessage },
  },
  additionalProperties: false,
  required: ['prompts'],
} as const

// 写法一 demo-get
export const querystringSchema = asConst({
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
  },
  additionalProperties: false,
  required: ['username'],
})

// demo-get
export const headersSchemaInter = asConst({
  type: 'object',
  properties: {
    'h-Custom': { type: 'string' },
  },
  additionalProperties: false,
  required: ['h-Custom'],
})

// // 写法二, demo
// export const todo ={
//   type: 'object',
//   properties: {
//     name: { type: 'string' },
//     description: { type: 'string' },
//     done: { type: 'boolean' },
//   },
//   required: ['name'],
// } as const; // don't forget to use const !
