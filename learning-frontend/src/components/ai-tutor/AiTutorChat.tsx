"use client";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Loader2, Sparkles } from "lucide-react";
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
    <div className="flex flex-col h-full bg-white overflow-hidden rounded-2xl border border-gray-100 shadow-lg">
      <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-3.5 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-100">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="font-bold text-gray-900 text-sm">Tuteur IA</span>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-600 font-medium">En ligne</span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 bg-white/60 px-2.5 py-1 rounded-full border border-gray-100">
          <Sparkles className="h-3 w-3 text-violet-400" />
          Alimenté par LLM
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm shadow-emerald-100">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
              msg.role === "user"
                ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-br-sm shadow-emerald-100"
                : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
            }`}>
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="flex-shrink-0 w-7 h-7 rounded-xl bg-gray-200 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-gray-500" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm">
              <Bot className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-bl-sm border border-gray-100 px-4 py-2.5 shadow-sm">
              <div className="flex gap-1 items-center h-4">
                {[0,1,2].map(i => (
                  <div key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-100 p-3 flex gap-2 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Posez votre question…"
          className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:bg-white transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 text-white hover:from-emerald-600 hover:to-teal-600 disabled:opacity-40 transition-all shadow-md shadow-emerald-100"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
