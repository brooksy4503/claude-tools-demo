import React from 'react';

const ToolsSidebar = () => {
  const tools = [
    {
      name: "Sentiment Analysis",
      description: "Analyzes the sentiment of text",
      example: "Check sentiment: I love this product!",
    },
    {
      name: "Word Counter",
      description: "Counts the number of words in text",
      example: "Count words: The quick brown fox jumps over the lazy dog",
    },
    {
      name: "Current DateTime",
      description: "Gets the current date and time",
      example: "What time is it?",
    },
    {
      name: "Hacker News Top Stories",
      description: "Fetches the top 3 current stories from Hacker News",
      example: "What are the top stories on Hacker News?",
    }
  ];

  return (
    <div className="w-64 h-full border-l border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Available Tools</h2>
      <div className="space-y-6">
        {tools.map((tool) => (
          <div key={tool.name} className="space-y-2">
            <h3 className="font-medium">{tool.name}</h3>
            <p className="text-sm text-gray-600">{tool.description}</p>
            <div className="bg-gray-100 p-2 rounded-md">
              <p className="text-sm font-mono">{tool.example}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolsSidebar; 