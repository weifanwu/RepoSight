import { NextResponse } from 'next/server';
import OpenAI from 'openai'; // Default import for OpenAI class

// Initialize OpenAI with API Key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface OpenAIRequestBody {
  prompt: string;
  model?: string; // Optional, defaults to "gpt-3.5-turbo"
}

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

    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
    });

    const completion = response.choices[0]?.message?.content;

    return NextResponse.json({ message: completion });
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error);
    return NextResponse.json(
      { error: 'Failed to process the request.' },
      { status: 500 }
    );
  }
}
