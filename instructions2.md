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