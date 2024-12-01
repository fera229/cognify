import { NextRequest, NextResponse } from 'next/server';
import { checkIfSessionIsValid } from '@/database/users';
import { Mistral } from '@mistralai/mistralai';

type AIResponseBody = {
  response: string;
  errors?: { message: string }[];
};

export async function POST(
  request: NextRequest,
): Promise<NextResponse<AIResponseBody>> {
  try {
    // Verify user session
    const validSession = await checkIfSessionIsValid();
    if (!validSession) {
      return NextResponse.json(
        {
          response: '',
          errors: [{ message: 'Unauthorized' }],
        } as AIResponseBody,
        { status: 401 },
      );
    }

    const body = await request.json();
    const { prompt } = body as { prompt: string };

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        {
          response: '',
          errors: [{ message: 'Prompt is required' }],
        } as AIResponseBody,
        { status: 400 },
      );
    }

    const systemPrompt = `You are a helpful learning assistant. Try to make your answers concise and in direct relevance to the user's question. For example, if the question can be answered in one line, don't answer in a 5 line paragraph.
    At the end of your precise yet informative answer, ask the user if they have any more questions, or if they want you to elaborate further and give more details.

    User's question: ${prompt}`;

    const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

    const chatResponse = await client.chat.complete({
      model: 'mistral-medium',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      maxTokens: 1024,
    });

    const responseContent = chatResponse?.choices?.[0]?.message?.content;

    if (!responseContent || Array.isArray(responseContent)) {
      throw new Error('Invalid response from Mistral API');
    }

    const response: AIResponseBody = {
      response: responseContent,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[AI_HELPER_ERROR]', error);
    return NextResponse.json(
      {
        response: '',
        errors: [{ message: 'Internal server error' }],
      } as AIResponseBody,
      { status: 500 },
    );
  }
}
