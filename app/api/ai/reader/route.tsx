import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface OpenAIRequestBody {
  prompt: string;
  model?: string;
}

// Handles POST requests to process OpenAI prompts and cache responses
export async function POST(req: Request) {
  try {
    const body: OpenAIRequestBody = await req.json();
    const { prompt, model = 'gpt-4o-mini' } = body;
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing "prompt" in request body.' },
        { status: 400 }
      );
    }

  
    const cachedResponse = await redis.get(prompt);
    if (cachedResponse) {
      return NextResponse.json({ message: cachedResponse });
    }

    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
    });

    const completion = response.choices[0]?.message?.content;

    if (!completion) {
      throw new Error('No completion received from OpenAI.');
    }

    await redis.set(prompt, completion, { ex: 3600 }); 

    return NextResponse.json({ message: completion });
  } catch (error) {
    console.error('Error processing the request:', error);
    return NextResponse.json(
      { error: 'Failed to process the request.' },
      { status: 500 }
    );
  }
}