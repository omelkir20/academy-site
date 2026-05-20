"use client";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Loader2 } from "lucide-react";
import { aiTutorApi } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AiTutorChatProps {
  courseId: number;
  lessonId?: number;
}

export function AiTutorChat({ courseId, lessonId }: AiTutorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Bonjour ! Je suis votre tuteur IA. Posez-moi n'importe quelle question sur ce cours." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);
    try {
      const { answer } = await aiTutorApi.ask(courseId, question, lessonId);
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Désolé, je n'ai pas pu répondre. Veuillez réessayer." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full border rounded-xl bg-white overflow-hidden">
      <div className="flex items-center gap-2 border-b px-4 py-3 bg-blue-50">
        <Bot className="h-5 w-5 text-blue-600" />
        <span className="font-semibold text-blue-900">Tuteur IA</span>
        <span className="ml-auto text-xs text-blue-500">Alimenté par LLM</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-gray-100 text-gray-800 rounded-bl-none"
            }`}>
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Posez votre question..."
          className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
