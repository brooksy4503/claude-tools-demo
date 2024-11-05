export const analyzeSentiment = (text: string) => {
    // Enhanced sentiment analysis implementation
    const positiveWords = [
        'good', 'great', 'awesome', 'excellent', 'happy', 'love',
        'wonderful', 'fantastic', 'joyful', 'delighted', 'pleased'
    ];
    const negativeWords = [
        'bad', 'terrible', 'awful', 'sad', 'hate', 'poor',
        'horrible', 'miserable', 'angry', 'upset', 'disappointed'
    ];

    // Split into words and remove punctuation
    const words = text.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/);
    let score = 0;
    let matches: string[] = [];

    words.forEach(word => {
        if (positiveWords.includes(word)) {
            score++;
            matches.push(`'${word}' (positive)`);
        }
        if (negativeWords.includes(word)) {
            score--;
            matches.push(`'${word}' (negative)`);
        }
    });

    return {
        sentiment: score > 0 ? "Positive" : score < 0 ? "Negative" : "Neutral",
        score: score,
        matches: matches,
        explanation: matches.length > 0
            ? `Found ${matches.join(', ')}`
            : "No clear sentiment words found"
    };
};

export const countWords = (text: string) => {
    return text.trim().split(/\s+/).length;
};

interface ToolCall {
    name: string;
    arguments: {
        text?: string;
        [key: string]: any;
    };
}

export const executeToolCall = async (toolCall: ToolCall) => {
    const { name, arguments: args } = toolCall;

    try {
        if (!name) {
            throw new Error('Tool name is undefined');
        }

        if (!args.text) {
            throw new Error('Text argument is required');
        }

        switch (name) {
            case "analyze_sentiment":
                return analyzeSentiment(args.text);
            case "count_words":
                return countWords(args.text);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error) {
        console.error(`Error executing tool ${name}:`, error);
        return {
            error: `Failed to execute tool ${name}`,
            details: error instanceof Error ? error.message : String(error)
        };
    }
}; 