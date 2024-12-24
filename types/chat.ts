export interface Message {
  role: "assistant" | "user";
  content: string;
}

export interface ChatResponse {
  message: string;
  threadId: string;
}

export interface Assistant {
  id: string;
  name: string;
}

export interface ChatThread {
  id: string;
  timestamp: string;
  assistantId: string;
  messages: Message[];
}