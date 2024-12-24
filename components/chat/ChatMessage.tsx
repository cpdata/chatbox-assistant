"use client";

import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-max max-w-[80%] rounded-lg px-4 py-2",
        message.role === "assistant"
          ? "bg-muted"
          : "bg-primary text-primary-foreground ml-auto"
      )}
    >
      {message.content}
    </div>
  );
}