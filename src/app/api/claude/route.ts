import { NextResponse } from 'next/server';
import { executeToolCall } from '@/utils/tools';

const tools = [
    {
        type: "function",
        function: {
            name: "analyze_sentiment",
            description: "When asked to analyze sentiment, check sentiment, or determine if text is positive/negative, use this tool. It analyzes the sentiment of text and returns whether it has a positive, negative, or neutral emotional tone.",
            parameters: {
                type: "object",
                properties: {
                    text: {
                        type: "string",
                        description: "The text to analyze for sentiment. Can be any length of text, from a single sentence to multiple paragraphs."
                    }
                },
                required: ["text"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "count_words",
            description: "When asked about word count, number of words, or how many words, use this tool. It counts the total number of words in a text by splitting on whitespace.",
            parameters: {
                type: "object",
                properties: {
                    text: {
                        type: "string",
                        description: "The text to count words from. Can be any length of text, from a single word to multiple paragraphs."
                    }
                },
                required: ["text"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_current_datetime",
            description: "Retrieves the current date and time. Useful when you need to know the current time, date, or time zone.",
            parameters: {
                type: "object",
                properties: {},
                required: []
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_hacker_news_top_stories",
            description: "Fetches the top 3 current stories from Hacker News, including title, link, points, and number of comments.",
            parameters: {
                type: "object",
                properties: {},
                required: []
            }
        }
    }
];

export async function POST(req: Request) {
    const { messages } = await req.json();

    const systemPrompt = `You are Claude, a helpful and knowledgeable AI assistant. Format your responses using Markdown for better readability:

- Use headers (##) for main topics
- Use bullet points or numbered lists where appropriate
- Use bold or italic text for emphasis
- Add line breaks between paragraphs
- Use code blocks when sharing code
- Use > for quotes or important notes

When answering general questions, provide direct, helpful responses without referencing your tool capabilities.

Available tools (use only when explicitly requested):
- analyze_sentiment: Analyzes the sentiment of text
- count_words: Counts words in text
- get_current_datetime: Gets current date and time
- fetch_hn_top_stories: Fetches top Hacker News stories`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": `${process.env.VERCEL_URL || 'http://localhost:3000'}`,
            "X-Title": "Claude Tools Demo"
        },
        body: JSON.stringify({
            model: "anthropic/claude-3.5-sonnet",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            tools: tools,
            tool_choice: "auto"
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenRouter API error:', errorData);
        return NextResponse.json({ error: errorData.error || "API request failed" }, { status: response.status });
    }

    const data = await response.json();
    console.log('OpenRouter API response:', data);

    if (data.choices?.[0]?.message?.tool_calls) {
        const toolCall = data.choices[0].message.tool_calls[0];
        console.log('Tool call:', toolCall);

        const toolName = toolCall.function?.name;
        const toolArgs = JSON.parse(toolCall.function?.arguments || '{}');

        const toolResult = await executeToolCall({
            name: toolName,
            arguments: toolArgs
        });

        const updatedMessages = [
            ...messages,
            {
                role: "assistant",
                content: data.choices[0].message.content,
                tool_calls: data.choices[0].message.tool_calls
            },
            {
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(toolResult)
            }
        ];

        return POST(new Request(req.url, {
            method: 'POST',
            headers: req.headers,
            body: JSON.stringify({ messages: updatedMessages })
        }));
    }

    return NextResponse.json(data);
}