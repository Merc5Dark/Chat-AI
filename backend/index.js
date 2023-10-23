// Import necessary modules
import express from 'express'; // Import the Express framework
import bodyParser from 'body-parser'; // Middleware for parsing JSON data in request bodies
import cors from 'cors'; // Middleware for handling Cross-Origin Resource Sharing
import { Configuration, OpenAIApi } from 'openai'; // Import OpenAI SDK

// Create an Express application
const app = express();
const port = 8000; // Define the port on which the server will listen

// Middleware
app.use(bodyParser.json()); // Use body-parser middleware to parse JSON data
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for the API

// OpenAI Configuration
const openaiConfig = new Configuration({
  apiKey: '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', // Set the OpenAI API key
});

const openai = new OpenAIApi(openaiConfig); // Create an instance of the OpenAI API

// Define the API endpoint
app.post('/', async (request, response) => {
  const { chats } = request.body; // Extract the 'chats' data from the request body

  try {
    // Use the OpenAI API to generate chat completions
    const result = await openai.createChatCompletion({
      model: 'gpt-3.5', // Specify the GPT-3.5 Turbo model
      messages: [
        { role: 'system', content: 'You are an AI' }, // Define a system message
        ...chats, // Add user and AI messages to the conversation
      ],
    });

    response.json({
      output: result.data.choices[0].message.content, // Send the generated chat completion as a JSON response
    });
  } catch (error) {
    response.status(500).json({ error: 'An error occurred while processing the request.' }); // Handle errors and send an error response
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

