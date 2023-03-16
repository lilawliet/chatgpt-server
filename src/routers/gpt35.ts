// import { chatCompletionRequestMessage } from "@/schemas"
// import { ChatCompletionRequestMessage } from "openai"
// import server from ".."


// server.post<{ Body: ChatCompletionRequestMessage[] }>(
//   '/gpt-3.5-turbo',
//   {
//     schema: {
//       body: chatCompletionRequestMessage,
//       response: {
//         201: {
//           type: 'string',
//         },
//       },
//     },
//   },
//   async (request, reply): Promise<void> => {
//     /*
//       request.body has type
//       {
//       [x: string]: unknown;
//       description?: string;
//       done?: boolean;
//       name: string;
//       }
//     */

//     const prompts = request.body // will not throw type error

//     reply.status(201).send()
//   }
// )