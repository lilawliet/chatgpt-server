import { asConst } from 'json-schema-to-ts'

export type Role = 'system' | 'user' | 'assistant'

// 写法一

const role = asConst({ enum: ['system', 'user', 'assistant'] })
export const chatCompletionRequestMessage = asConst({
  type: 'object',
  properties: {
    role: role,
    content: { type: 'string' },
  },
  required: ['role', 'content'],
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
