'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { getChatThreads } from '@/lib/cookies';
import { format } from 'date-fns';
import { History } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ChatThread } from '@/types/chat';

interface ChatHistoryProps {
  onThreadSelect: (threadId: string) => void;
}

export function ChatHistory({ onThreadSelect }: ChatHistoryProps) {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setThreads(getChatThreads());
  }, []);

  const handleThreadSelect = (threadId: string) => {
    onThreadSelect(threadId);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <History className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Chat History</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          {threads.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No previous conversations
            </p>
          ) : (
            <div className="space-y-2">
              {threads.map((thread) => (
                <Button
                  key={thread.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleThreadSelect(thread.id)}
                >
                  <div className="text-left">
                    <p className="font-medium">
                      {format(new Date(thread.timestamp), 'PPp')}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {thread.messages[0]?.content || 'Empty conversation'}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
