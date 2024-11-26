import React, { useState } from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { Groq } from 'groq-sdk';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! How can I help you today?',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (content: string) => {
    // Reset error state
    setError(null);
    
    // Add user message
    const userMessage: Message = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      if (!import.meta.env.VITE_GROQ_API_KEY) {
        throw new Error('GROQ API key is not configured');
      }

      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true, 
      });

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful trucking industry assistant. Provide clear, concise answers about trucking regulations, routes, equipment, and best practices.',
          },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content },
        ],
        model: 'mixtral-8x7b-32768',
        temperature: 0.7,
        max_tokens: 1024,
      });

      if (!completion.choices?.[0]?.message?.content) {
        throw new Error('No response received from AI');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: completion.choices[0].message.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Error getting AI response:', err);
      setError(err.message || 'An error occurred while processing your request');
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error processing your request. Please try again later.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-8 h-8" />
          Messages
        </h1>
        <p className="text-gray-600 mt-1">Chat with our AI assistant for help and support</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {isTyping && (
            <div className="flex gap-2 items-center text-gray-500">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="animate-pulse">...</span>
              </div>
              <span>AI is typing...</span>
            </div>
          )}
        </div>

        <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
};

export default MessagesPage;