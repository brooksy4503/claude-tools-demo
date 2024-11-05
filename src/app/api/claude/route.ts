import { NextResponse } from 'next/server';
import { analyzeSentiment, countWords, executeToolCall } from '@/utils/tools';

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
    }
];

export async function POST(req: Request) {
    const body = await req.json();
    console.log('Received request body:', body);

    try {
        const requestBody = {
            model: "anthropic/claude-3.5-sonnet",
            messages: body.messages,
            stream: false,
            max_tokens: 1024,
            tools: tools,
            tool_choice: "auto"
        };

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": `${process.env.VERCEL_URL || 'http://localhost:3000'}`,
                "X-Title": "Claude Tools Demo",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
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
                ...body.messages,
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
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}