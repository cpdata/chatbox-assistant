import { ChatThread } from '@/types/chat';
import Cookies from 'js-cookie';
import { IS_DISPLAY_MODE } from '@/lib/constants';
import { MOCK_THREADS } from './mock-data';

const CHAT_THREADS_KEY = 'chat_threads';

export function saveChatThread(thread: ChatThread): void {
  if (IS_DISPLAY_MODE) return;
  const existingThreads = getChatThreads();
  const updatedThreads = [
    thread,
    ...existingThreads.filter((t) => t.id !== thread.id),
  ];
  Cookies.set(CHAT_THREADS_KEY, JSON.stringify(updatedThreads));
}

export function getChatThreads(): ChatThread[] {
  if (IS_DISPLAY_MODE) return MOCK_THREADS;
  const threadsJson = Cookies.get(CHAT_THREADS_KEY);
  return threadsJson ? JSON.parse(threadsJson) : [];
}

export function getChatThread(id: string): ChatThread | undefined {
  if (IS_DISPLAY_MODE) return MOCK_THREADS.find((thread) => thread.id === id);
  return getChatThreads().find((thread) => thread.id === id);
}
