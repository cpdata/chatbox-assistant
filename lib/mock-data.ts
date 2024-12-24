import { ChatThread, Assistant } from "@/types/chat";

export const MOCK_ASSISTANTS: Assistant[] = [
  { id: "mock_asst_1", name: "Customer Support" },
  { id: "mock_asst_2", name: "Technical Advisor" },
];

export const MOCK_THREADS: ChatThread[] = [
  {
    id: "thread_1",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    assistantId: "mock_asst_1",
    messages: [
      { role: "user", content: "How can I reset my password?" },
      { role: "assistant", content: "I can help you with that! To reset your password, please click on the 'Forgot Password' link on the login page and follow the instructions sent to your email." },
    ],
  },
  {
    id: "thread_2",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    assistantId: "mock_asst_2",
    messages: [
      { role: "user", content: "How do I deploy my Next.js application?" },
      { role: "assistant", content: "To deploy your Next.js application, you can use Vercel, which offers the easiest deployment process. Simply connect your GitHub repository and Vercel will automatically deploy your application." },
    ],
  },
];