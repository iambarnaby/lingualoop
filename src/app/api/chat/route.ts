import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY not configured. Add it to your .env.local file.' },
      { status: 500 }
    );
  }

  try {
    const { message, phrases, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    const phraseList =
      phrases && phrases.length > 0
        ? phrases
            .map((p: { phrase: string; translation: string }) => `"${p.phrase}" (${p.translation})`)
            .join('\n')
        : 'No specific phrases provided yet.';

    const client = new Anthropic({ apiKey });

    const systemPrompt = `You are a language practice partner. Your role is to have a natural conversation with the learner, using the following common phrases as much as possible. Act like you are running through a scripted dialogue — guide the conversation so the learner gets to practice these phrases in context.

Common phrases to use:
${phraseList}

Guidelines:
- Use the common phrases almost exclusively in your responses
- Keep responses short (1-3 sentences)
- If the learner seems stuck, gently guide them toward using one of the phrases
- Mix the target language phrases with English translations in parentheses when first introducing them
- Be encouraging and natural
- Create realistic conversation scenarios (ordering food, asking directions, greetings, etc.)`;

    const messages: Anthropic.MessageParam[] = [
      ...(history || []).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ];

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      system: systemPrompt,
      messages,
    });

    const reply =
      response.content[0].type === 'text' ? response.content[0].text : 'I could not generate a response.';

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to get response' },
      { status: 500 }
    );
  }
}
