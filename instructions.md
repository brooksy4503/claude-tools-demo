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

## Tool Implementation Challenges

### TypeScript Type Safety Errors

#### Tool Argument Handling
**Error**: Argument of type 'string | undefined' is not assignable to parameter of type 'string'
**Fix**: Modify `executeToolCall` to handle optional arguments safely
```typescript
export const executeToolCall = async (toolCall: ToolCall) => {
    switch (name) {
        case "analyze_sentiment":
        case "count_words":
            // Explicitly check and handle text argument
            if (!args.text) {
                throw new Error('Text argument is required');
            }
            return name === "analyze_sentiment"
                ? analyzeSentiment(args.text!)
                : countWords(args.text!);
        case "get_current_datetime":
            // Allow tool without text argument
            return getCurrentDateTime();
    }
}
```

#### Tool Interface Definition
**Best Practice**: Define a flexible `ToolCall` interface to support various tool arguments
```typescript
interface ToolCall {
    name: string;
    arguments: {
        text?: string;  // Optional text argument
        [key: string]: any;  // Allow additional dynamic arguments
    };
}
```

### Tool Execution Challenges

#### Handling Tools with Different Argument Requirements
**Problem**: Some tools require text, some don't
**Solution**: Implement conditional argument checking in `executeToolCall`
- Use type-safe argument extraction
- Provide clear error messages
- Support tools with and without arguments

#### OpenRouter API Tool Call Parsing
**Common Pitfalls**:
1. Incorrect tool name extraction
```typescript
// ❌ Incorrect
const toolName = toolCall.name;

// ✅ Correct
const toolName = toolCall.function?.name;
const toolArgs = JSON.parse(toolCall.function?.arguments || '{}');
```

### Debugging Strategies

#### Logging Tool Calls
```typescript
console.log('Tool call received:', {
    name: toolCall.function?.name,
    arguments: toolCall.function?.arguments
});
```

#### Error Handling in Tool Execution
```typescript
try {
    const toolResult = await executeToolCall({
        name: toolName,
        arguments: toolArgs
    });
} catch (error) {
    console.error('Tool execution failed:', error);
    // Provide user-friendly error handling
}
```

### Performance and Security Considerations

1. Validate tool names against a predefined list
2. Implement strict type checking
3. Use non-null assertions (`!`) sparingly
4. Prefer type assertions or type guards

### Recommended Tool Design Patterns

1. **Flexible Argument Handling**
   - Support optional arguments
   - Provide default values
   - Validate input rigorously

2. **Clear Error Messages**
   - Specific error descriptions
   - Helpful debugging information
   - User-friendly error handling

3. **Extensible Tool Architecture**
   - Easy to add new tools
   - Consistent execution pattern
   - Minimal boilerplate code

## Layout and Scrolling Issues

### Common Layout Problems

1. Sidebar Content Not Scrolling
```typescript
// ❌ Wrong - Using ScrollArea without proper container setup
<ScrollArea>
  <div className="p-4 space-y-4">
    {tools.map((tool) => (...))}
  </div>
</ScrollArea>

// ✅ Correct - Using native scrolling with proper overflow handling
<aside className="border-r bg-muted/40 flex flex-col overflow-hidden">
  <div className="border-b px-4 py-2 flex-none">
    <h2 className="text-lg font-semibold">Available Tools</h2>
  </div>
  <div className="flex-1 overflow-auto">
    <div className="p-4 space-y-4">
      {tools.map((tool) => (...))}
    </div>
  </div>
</aside>
```

2. Chat Area Not Filling Screen
```typescript
// ❌ Wrong - Using fixed heights or incomplete flex setup
<main className="h-screen">
  <div className="chat-area">...</div>
</main>

// ✅ Correct - Using proper flex layout and overflow handling
<main className="flex flex-col h-full overflow-hidden">
  <div className="flex-1 overflow-auto p-4">
    <div className="max-w-3xl mx-auto space-y-4">
      {messages.map((message) => (...))}
    </div>
  </div>
  <footer className="border-t p-4 flex-none bg-background">
    {...}
  </footer>
</main>
```

3. Mobile Viewport Height Issues
```typescript
// ❌ Wrong - Using h-screen which can cause issues on mobile
<div className="h-screen">

// ✅ Correct - Using dynamic viewport height
<div className="h-[100dvh]">
```

### Best Practices for Layout

1. Flex Container Structure:
   - Use `flex-none` for fixed-height elements
   - Use `flex-1` for expanding elements
   - Add `overflow-hidden` to containers
   - Add `overflow-auto` to scrollable areas

2. Mobile Considerations:
   - Use dynamic viewport height (`dvh`)
   - Test on different devices
   - Handle keyboard appearance

3. Scroll Management:
   - Implement smooth scrolling
   - Handle scroll to bottom on new messages
   - Style scrollbars for better UX

4. Footer Positioning:
   - Keep input area visible
   - Handle overflow properly
   - Add background color to ensure visibility

### CSS Solutions

1. Scrollbar Styling
```css
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    @apply bg-slate-300 dark:bg-slate-600;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    @apply bg-slate-400 dark:bg-slate-500;
}
```

2. Flex Container Rules
```css
.flex-1 {
    min-width: 0; /* Prevents flex item overflow */
}
```

3. Smooth Scrolling
```css
@layer base {
    html {
        scroll-behavior: smooth;
    }
}
```

### Debugging Layout Issues

1. Common Signs of Layout Problems:
   - Content disappearing behind footer
   - Scrolling not working in specific areas
   - Layout breaking on mobile devices
   - Content overflow issues

2. Debugging Steps:
   - Inspect element hierarchy
   - Check flex container setup
   - Verify overflow properties
   - Test on different viewports

3. Performance Considerations:
   - Monitor scroll performance
   - Check for layout shifts
   - Optimize render cycles
   - Handle large message lists