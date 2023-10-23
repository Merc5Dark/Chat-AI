import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

const app = express();
const port = 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// OpenAI Configuration
const openaiConfig = new Configuration({
  apiKey: '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',
});

const openai = new OpenAIApi(openaiConfig);

// Define the API endpoint
app.post('/', async (request, response) => {
  const { chats } = request.body;

  try {
    // Use the OpenAI API to generate chat completions
    const result = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an AI' },
        ...chats,
      ],
    });

    response.json({
      output: result.data.choices[0].message.content,
    });
  } catch (error) {
    response.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
