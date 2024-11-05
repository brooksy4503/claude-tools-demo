# Step-by-Step Instructions: Building the Claude Tools Demo

## Prerequisites
- Node.js installed (v18+ recommended)
- Basic knowledge of React, TypeScript, and Next.js
- OpenRouter API key

## Step 1: Create Next.js Project
```bash
npx create-next.js@latest claude-tools-demo
```
Just press Enter to accept the following defaults:
- TypeScript - Yes
- TailwindCSS - Yes 
- App Router - Yes
- ESLint - Yes
- `src/` directory - Yes
- Import alias (@/*) - Yes

## Step 2: Set Up Environment
1. Create `.env.local` in root:
```bash
OPENROUTER_API_KEY=your-api-key-here
VERCEL_URL=http://localhost:3000
```

2. Add `.env.local` to `.gitignore` if not already present

## Step 3: Create Tools Utility
Create `src/utils/tools.ts`:
1. Implement sentiment analysis
2. Implement word counter
3. Add tool execution logic

Common Error: TypeScript errors about implicit 'any[]'
```typescript
// ❌ Wrong
let matches = [];

// ✅ Correct
let matches: string[] = [];
```

## Step 4: Create API Route
Create `src/app/api/claude/route.ts`:
1. Define tools schema
2. Implement POST handler
3. Add OpenRouter API integration

Common Errors:
1. 400 Bad Request - Tool Choice Error
```typescript
// ❌ Wrong
tool_choice: "auto",
tools: undefined

// ✅ Correct
tools: tools,
tool_choice: "auto"
```

2. Tool Execution Error
```typescript
// ❌ Wrong
const toolName = toolCall.name;

// ✅ Correct
const toolName = toolCall.function?.name;
const toolArgs = JSON.parse(toolCall.function?.arguments || '{}');
```

## Step 5: Create Frontend
Update `src/app/page.tsx`:
1. Add chat interface
2. Implement message handling
3. Add loading states

Common Issues:
1. Messages not scrolling to bottom
```typescript
// ✅ Add useRef and useEffect
const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);
```

2. Enter key submitting instead of new line
```typescript
// ✅ Add handleKeyDown
const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
    }
};
```

## Step 6: Style the Application
1. Update `globals.css` with Tailwind imports
2. Add custom CSS variables
3. Style components using Tailwind classes

## Step 7: Testing
Test the following scenarios:
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

Common Issues:
- Tool not being called: Make sure prompts are clear and match tool descriptions
- Sentiment not detecting: Check punctuation handling in sentiment analyzer
- Word count incorrect: Verify whitespace handling

## Step 8: Deployment
1. Push to GitHub
2. Deploy to Vercel:
   - Add environment variables
   - Configure build settings

Common Deployment Issues:
1. API Key not working
```
❌ Error: Failed to process request
✅ Solution: Check environment variables in Vercel dashboard
```

2. CORS errors
```
❌ Error: No 'Access-Control-Allow-Origin' header
✅ Solution: Verify VERCEL_URL environment variable
```

## Best Practices
1. Error Handling:
   - Always handle API errors gracefully
   - Provide user feedback for failures
   - Log errors for debugging

2. TypeScript:
   - Define interfaces for all data structures
   - Avoid using 'any' type
   - Use proper type annotations

3. State Management:
   - Keep state updates atomic
   - Use proper state initialization
   - Handle loading states

4. UI/UX:
   - Show loading indicators
   - Provide clear feedback
   - Handle edge cases (empty states, errors)

## Troubleshooting Guide

### API Issues
1. 400 Bad Request
   - Check API key format
   - Verify request body structure
   - Ensure tools are properly formatted

2. Tool Execution Failures
   - Check tool name matches exactly
   - Verify argument parsing
   - Log tool call data for debugging

### Frontend Issues
1. Message Display
   - Check message array structure
   - Verify state updates
   - Confirm CSS classes

2. Input Handling
   - Test Enter key behavior
   - Verify form submission
   - Check disabled states

### Performance
1. Message History
   - Consider pagination for long chats
   - Implement virtualization if needed
   - Optimize state updates

2. API Response Time
   - Add request timeouts
   - Implement retry logic
   - Cache responses where appropriate