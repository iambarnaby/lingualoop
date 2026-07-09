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
    const { words } = await request.json();

    if (!words || !Array.isArray(words) || words.length === 0) {
      return NextResponse.json({ error: 'No words provided' }, { status: 400 });
    }

    const wordList = words
      .map((w: { word: string; translation: string }) => `${w.word} (${w.translation})`)
      .join(', ');

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a TPRS (Teaching Proficiency through Reading and Storytelling) language teacher. Create a short, engaging, comprehensible story that naturally incorporates the following vocabulary words. The story should:

1. Be written primarily in English but weave in the target vocabulary words naturally
2. Use simple, repetitive sentence structures (a key TPRS principle)
3. Be engaging and slightly humorous if possible
4. Be 150-250 words long
5. Use each vocabulary word at least once, ideally 2-3 times
6. Bold the vocabulary words by wrapping them in **asterisks**

Vocabulary to include: ${wordList}

Respond with ONLY a JSON object in this exact format:
{"title": "Story Title", "content": "The story text here..."}

Do not include any other text outside the JSON.`,
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse story response');
      }
    }

    return NextResponse.json({
      title: parsed.title || 'Untitled Story',
      content: (parsed.content || '').replace(/\*\*/g, ''),
    });
  } catch (err) {
    console.error('Story generation error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate story' },
      { status: 500 }
    );
  }
}
