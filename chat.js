import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
import * as readline from 'readline';

// Load environment variables from .env or .env.local
dotenv.config();
dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('\n❌ Error: GEMINI_API_KEY environment variable is missing.');
  console.error('Please add GEMINI_API_KEY=your_api_key to your .env or .env.local file.\n');
  process.exit(1);
}

// Initialize the Google Gen AI client
const ai = new GoogleGenAI({ apiKey });

// Initialize readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n========================================================');
console.log('🤖 Terminal AI Chat (powered by Gemini)');
console.log('Type "exit" or "quit" to stop the chat.');
console.log('========================================================\n');

async function startChat() {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are a helpful AI assistant.',
      }
    });

    const askQuestion = () => {
      rl.question('\n👤 You: ', async (userInput) => {
        const input = userInput.trim();
        
        if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
          console.log('\n👋 Goodbye!\n');
          rl.close();
          return;
        }
        
        if (!input) {
          askQuestion();
          return;
        }

        try {
          process.stdout.write('🤖 AI: typing...');
          const response = await chat.sendMessage({ message: input });
          
          // Clear "typing..."
          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          
          console.log(`🤖 AI:\n${response.text}`);
        } catch (error) {
          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          console.error(`❌ Error communicating with AI: ${error.message}`);
        }
        
        askQuestion();
      });
    };

    askQuestion();
  } catch (error) {
    console.error('Failed to initialize chat:', error);
    process.exit(1);
  }
}

startChat();
