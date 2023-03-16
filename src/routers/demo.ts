// import { headersSchemaInter, querystringSchema } from "@/schemas"
// import { FromSchema } from "json-schema-to-ts"

// server.get<{
//   Querystring: FromSchema<typeof querystringSchema>,
//   // Headers: FromSchema<typeof headersSchemaInter>
// }>('/demo-get', {
//   schema: {
//     querystring: querystringSchema,
//     // headers: headersSchemaInter
//   },
//   preValidation: (request, reply, done) => {
//     const { username, password } = request.query
//     done(username !== 'admin' ? new Error('Must be admin') : undefined)
//   }
// }, async (request, reply) => {
//   const customerHeader = request.headers['h-Custom']
//   return `logged in!`
// })
