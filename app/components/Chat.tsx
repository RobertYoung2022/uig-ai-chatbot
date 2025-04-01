import { useChat } from 'ai/react';
import { Message } from '@/app/types';
import ReactMarkdown from 'react-markdown';
import { useRef, useEffect } from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'assistant'
                  ? 'bg-white text-gray-800'
                  : 'bg-blue-600 text-white'
              }`}
            >
              <ReactMarkdown
                className="prose prose-sm max-w-none"
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} className="text-blue-400 hover:text-blue-300" />
                  ),
                  code: ({ node, ...props }) => (
                    <code {...props} className="bg-gray-800 rounded px-1" />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex space-x-4">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about crypto investments..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg bg-blue-600 text-white font-medium ${
              isLoading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-700 transition-colors'
            }`}
          >
            {isLoading ? 'Thinking...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
} 