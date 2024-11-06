

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

export const getCurrentDateTime = () => {
    const now = new Date();
    return {
        fullDateTime: now.toLocaleString(),
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        isoString: now.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
};

export const getHackerNewsTopStories = async () => {
    try {
        // Fetch top stories from Hacker News Algolia API
        const response = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=3');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const topStories = data.hits.map((hit: any) => ({
            title: hit.title || 'Untitled',
            link: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
            points: hit.points || 0,
            comments: hit.num_comments || 0,
            formattedLink: `[${hit.title || 'Read More'}](${hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`})`,
            htmlLink: `<a href="${hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`}" target="_blank">${hit.title || 'Read More'}</a>`
        }));

        // Log the extracted stories for debugging
        console.log('Extracted Top Stories:', JSON.stringify(topStories, null, 2));

        return {
            stories: topStories,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error Fetching Hacker News stories:', {
            errorMessage: error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : 'No stack trace',
            errorName: error instanceof Error ? error.name : 'Unknown Error'
        });

        return {
            error: 'Failed to fetch Hacker News stories',
            details: error instanceof Error ? error.message : String(error)
        };
    }
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

        switch (name) {
            case "analyze_sentiment":
            case "count_words":
                // These tools require text
                if (!args.text) {
                    throw new Error('Text argument is required');
                }
                return name === "analyze_sentiment"
                    ? analyzeSentiment(args.text!)
                    : countWords(args.text!);
            case "get_current_datetime":
                // No text argument needed
                return getCurrentDateTime();
            case "get_hacker_news_top_stories":
                return getHackerNewsTopStories();
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