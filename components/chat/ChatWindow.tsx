'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Minimize2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage } from './ChatMessage';
import { Message, ChatThread } from '@/types/chat';
import { AssistantSelector } from './AssistantSelector';
import { ChatHistory } from './ChatHistory';
import {
  REQUIRED_ENV_VARS,
  AVAILABLE_ASSISTANTS,
  IS_DISPLAY_MODE,
} from '@/lib/constants';
import { saveChatThread, getChatThread } from '@/lib/cookies';

export function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [currentAssistantId, setCurrentAssistantId] = useState(
    AVAILABLE_ASSISTANTS[0].id
  );
  const [envError, setEnvError] = useState<string | null>(null);

  useEffect(() => {
    if (!IS_DISPLAY_MODE) {
      const missingVars = Object.entries(REQUIRED_ENV_VARS)
        .filter(([key]) => !process.env[key])
        .map(([, name]) => name);

      if (missingVars.length > 0) {
        setEnvError(
          `Environment Variables are not set! Required: ${missingVars.join(
            ', '
          )}`
        );
      }
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading || (envError && !IS_DISPLAY_MODE)) return;

    const newMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (IS_DISPLAY_MODE) {
        // Mock response
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockResponse = {
          message: `This is a mock response from the assistant. You said: "${input}"`,
          threadId: 'mock_thread_' + Date.now(),
        };
        setThreadId(mockResponse.threadId);

        const newAssistantMessage: Message = {
          role: 'assistant',
          content: mockResponse.message,
        };

        const updatedMessages = [...messages, newMessage, newAssistantMessage];
        setMessages(updatedMessages);
      } else {
        // Real API call
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: input,
            threadId,
            assistantId: currentAssistantId,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        setThreadId(data.threadId);

        const newAssistantMessage: Message = {
          role: 'assistant',
          content: data.message,
        };

        const updatedMessages = [...messages, newMessage, newAssistantMessage];
        setMessages(updatedMessages);

        // Save to cookies
        const thread: ChatThread = {
          id: data.threadId,
          timestamp: new Date().toISOString(),
          assistantId: currentAssistantId,
          messages: updatedMessages,
        };
        saveChatThread(thread);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThreadSelect = (selectedThreadId: string) => {
    const thread = getChatThread(selectedThreadId);
    if (thread) {
      setThreadId(thread.id);
      setMessages(thread.messages);
      setCurrentAssistantId(thread.assistantId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card
      className={cn(
        'fixed bottom-4 right-4 w-[400px] shadow-lg transition-all duration-200',
        isMinimized ? 'h-[60px]' : 'h-[500px]'
      )}
    >
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80"
              alt="AI Assistant"
              className="object-cover"
            />
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {AVAILABLE_ASSISTANTS.find((a) => a.id === currentAssistantId)
                ?.name || 'AI Assistant'}
            </h3>
            <p className="text-sm text-muted-foreground">Chat</p>
          </div>
        </div>
        <div className="flex gap-2">
          <AssistantSelector
            currentAssistantId={currentAssistantId}
            onAssistantChange={setCurrentAssistantId}
          />
          <ChatHistory onThreadSelect={handleThreadSelect} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <ScrollArea className="flex-1 p-4 h-[360px]">
            <div className="space-y-4">
              {envError ? (
                <div className="text-destructive text-center p-4">
                  {envError}
                </div>
              ) : (
                messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))
              )}
            </div>
          </ScrollArea>
          <div className="border-t p-4 space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder={
                  envError
                    ? 'Chat disabled - Missing environment variables'
                    : 'Type a message...'
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading || !!envError}
              />
              <Button onClick={handleSend} disabled={isLoading || !!envError}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
