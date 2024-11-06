# Claude Tools Demo

A demo application showcasing Claude's tool use capabilities through OpenRouter. This project demonstrates how to build a chat interface that leverages Claude's ability to use custom tools for tasks like sentiment analysis and word counting. Please note that live demo does not have api connected. You will need to add your own api key.

## Features

- 🤖 Chat interface with Claude AI
- 🛠️ Custom tool integration (sentiment analysis, word counter, top stories from Hacker News)
- ⚡ Real-time responses
- 🎨 Clean, responsive UI
- 🌙 Dark mode support

## Prerequisites

- Node.js (v18+ recommended)
- Basic knowledge of React, TypeScript, and Next.js
- OpenRouter API key ([Get one here](https://openrouter.ai/keys))

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/claude-tools-demo.git
cd claude-tools-demo
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory:
```bash
OPENROUTER_API_KEY=your-api-key-here
VERCEL_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing the Tools

Try these example prompts to test the tools:

1. Sentiment Analysis:
```
"Check sentiment: I love this product!"
"Analyze: This is terrible."
```

2. Word Count:
```
"Count words: The quick brown fox"
"How many words in: Hello world"
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── claude/    # API routes for Claude integration
│   ├── page.tsx       # Main chat interface
│   └── layout.tsx     # Root layout
├── utils/
│   └── tools.ts       # Tool implementations
└── ...
```

## Common Issues & Solutions

### API Key Issues
- Ensure your OpenRouter API key is properly set in `.env.local`
- Check that the key has sufficient credits

### CORS Errors
- Verify the `VERCEL_URL` environment variable is set correctly
- For local development, it should be `http://localhost:3000`

### Tool Execution Issues
- Make sure prompts are clear and match tool descriptions
- Check console for any error messages
- Verify tool arguments are being parsed correctly

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in the Vercel dashboard
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Claude API Documentation](https://docs.anthropic.com/claude/docs)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
