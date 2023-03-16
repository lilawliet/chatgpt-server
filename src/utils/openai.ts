import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
})

const OPEN_AI = new OpenAIApi(configuration)

export default OPEN_AI
