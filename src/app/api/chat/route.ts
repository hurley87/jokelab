import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Configure runtime
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: 'OpenAI API key is missing. Please set the OPENAI_API_KEY environment variable.'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { messages, jokePreferences, evaluateJoke } = await req.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If this is a joke evaluation request
    if (evaluateJoke && messages.length >= 2) {
      const jokeContent = messages[messages.length - 2].content;
      
      // Create a system prompt for joke evaluation
      const evaluationPrompt = `You are a comedy critic AI that evaluates jokes. 
      Analyze the following joke and provide a structured evaluation:
      
      "${jokeContent}"
      
      Provide your evaluation in the following JSON format:
      {
        "funnyRating": [number between 1-10],
        "appropriatenessRating": [number between 1-10],
        "originalityRating": [number between 1-10],
        "tags": [array of tags that describe the joke, e.g., "clever", "dark", "silly", "offensive", "clean", "wordplay", etc.],
        "feedback": [brief constructive feedback about the joke]
      }
      
      Only respond with the JSON object, nothing else.`;
      
      const result = streamText({
        model: openai('gpt-4o-mini'),
        system: evaluationPrompt,
        messages: [{ role: 'user', content: 'Evaluate this joke' }],
      });
      
      return result.toDataStreamResponse();
    }

    // Default system message
    let systemMessage = 'You are a helpful assistant.';
    
    // If joke preferences are provided, customize the system message
    if (jokePreferences) {
      systemMessage = `You are a comedy assistant specialized in creating jokes. 
      
      Create a joke with these specifications:
      - Topic: ${jokePreferences.topic || 'any topic'}
      - Tone: ${jokePreferences.tone || 'any tone'} 
      - Type: ${jokePreferences.type || 'any type'}
      - Creativity level: ${jokePreferences.temperature ? 'high (be very creative and unexpected)' : 'moderate (be somewhat predictable)'}
      
      Guidelines:
      - Focus exclusively on delivering a single joke that matches the specifications
      - Format the joke clearly with proper setup and punchline
      - For story-type jokes, keep them concise and focused
      - For knock-knock jokes, use the standard format
      - For riddles, provide the answer after a brief pause
      - Ensure the joke aligns with the requested tone
      - Do not explain the joke or add commentary before or after
      - Do not include any meta-text like "Here's your joke:" or "Hope you enjoy this joke!"
      
      Respond with ONLY the joke content.`;
    }

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: systemMessage,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in chat API route:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred processing your request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}