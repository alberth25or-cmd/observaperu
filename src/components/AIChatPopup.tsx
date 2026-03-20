"use client";

import * as PopoverPrimitives from "@radix-ui/react-popover";
import {
  ComponentProps,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageRole = "user" | "assistant";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string; // ISO string — safe for localStorage serialization
}

interface ChatMeta {
  id: string;
  title: string | null;
  createdAt: string;
  lastMessageAt: string | null;
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function uid(): string {
  return crypto.randomUUID();
}

// One default chat per hour (mirrors original behavior)
function getDefaultChatId(): string {
  return new Date().toISOString().slice(0, 13);
}

// ─── Suggestion pills ─────────────────────────────────────────────────────────

const SUGGESTIONS = [
  {
    label: "Candidatos 2026",
    message:
      "¿Quiénes son los principales candidatos presidenciales en Perú para las elecciones 2026?",
  },
  {
    label: "Comparar candidatos",
    message:
      "Compara las propuestas económicas de los candidatos disponibles en la plataforma",
  },
  {
    label: "Mapa ideológico",
    message:
      "¿Cómo se ubican los candidatos en el espectro político ideológico?",
  },
  {
    label: "Planes de gobierno",
    message:
      "Resume los puntos más importantes de los planes de gobierno disponibles",
  },
];

// ─── Hook: chat list (localStorage) ──────────────────────────────────────────
//
// MASTRA INTEGRATION POINT:
// To persist chats server-side using Mastra Memory instead of localStorage,
// replace this hook with one that calls the Mastra Memory Threads API:
//
//   GET    {MASTRA_SERVER_URL}/memory/threads?resourceId={userId}  → load list
//   POST   {MASTRA_SERVER_URL}/memory/threads                      → create thread
//   DELETE {MASTRA_SERVER_URL}/memory/threads/{threadId}           → delete thread
//
// See: https://mastra.ai/docs/memory/overview

const CHATS_STORAGE_KEY = "observaperu-ai-chats";

function useChats() {
  const [chats, setChats] = useState<ChatMeta[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CHATS_STORAGE_KEY);
      if (stored) setChats(JSON.parse(stored));
    } catch {
      // Ignore parse errors (e.g. corrupted data)
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
    } catch {
      // Ignore quota errors (e.g. private browsing limits)
    }
  }, [chats]);

  const createChat = useCallback((id?: string): string => {
    const newId = id ?? uid();
    setChats((prev) => {
      if (prev.find((c) => c.id === newId)) return prev;
      return [
        {
          id: newId,
          title: null,
          createdAt: new Date().toISOString(),
          lastMessageAt: null,
        },
        ...prev,
      ];
    });
    return newId;
  }, []);

  const deleteChat = useCallback((id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    try {
      localStorage.removeItem(`observaperu-ai-messages-${id}`);
    } catch {}
  }, []);

  const updateChatMeta = useCallback(
    (id: string, patch: Partial<Pick<ChatMeta, "title" | "lastMessageAt">>) => {
      setChats((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
      );
    },
    []
  );

  return { chats, createChat, deleteChat, updateChatMeta };
}

// ─── Hook: messages for a single chat (localStorage) ─────────────────────────
//
// MASTRA INTEGRATION POINT:
// To load and persist messages via Mastra Memory instead of localStorage,
// replace this hook with one that calls:
//
//   GET {MASTRA_SERVER_URL}/memory/threads/{threadId}/messages  → load messages
//
// Messages are automatically stored by Mastra when you call agent.generate()
// or agent.stream() with a `threadId` argument — you don't need to POST them
// manually. Just read them back from the API for the listing.

const messagesStorageKey = (chatId: string) =>
  `observaperu-ai-messages-${chatId}`;

function useChatMessages(chatId: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  // Reload messages whenever the active chat changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(messagesStorageKey(chatId));
      setMessages(stored ? JSON.parse(stored) : []);
    } catch {
      setMessages([]);
    }
  }, [chatId]);

  const appendMessages = useCallback(
    (incoming: Message[]) => {
      setMessages((prev) => {
        const updated = [...prev, ...incoming];
        try {
          localStorage.setItem(
            messagesStorageKey(chatId),
            JSON.stringify(updated)
          );
        } catch {}
        return updated;
      });
    },
    [chatId]
  );

  return { messages, appendMessages };
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function AIChatPopup() {
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — localStorage is client-only
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex size-14 items-center border border-neutral-200 justify-center rounded-full bg-white shadow-[0px_36px_49px_0px_rgba(0,0,0,0.01),0px_15.04px_20.471px_0px_rgba(0,0,0,0.01),0px_8.041px_10.945px_0px_rgba(0,0,0,0.01),0px_4.508px_6.136px_0px_rgba(0,0,0,0.00),0px_2.394px_3.259px_0px_rgba(0,0,0,0.00),0px_0.996px_1.356px_0px_rgba(0,0,0,0.00)] transition-all fixed bottom-8 right-8 z-40 duration-200">
        <SparklesIcon className="fill-neutral-400 size-7" />
      </div>
    );
  }

  return <ChatPopup />;
}

// ─── ChatPopup ────────────────────────────────────────────────────────────────

function ChatPopup() {
  const { chats, createChat, deleteChat, updateChatMeta } = useChats();
  const [chatId, setChatId] = useState<string>(getDefaultChatId);
  const [showListing, setShowListing] = useState(false);

  // Ensure the default chat is registered on mount
  useEffect(() => {
    createChat(chatId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const goToChat = useCallback((id: string) => {
    setChatId(id);
    setShowListing(false);
  }, []);

  const handleNewChat = useCallback(() => {
    goToChat(createChat());
  }, [createChat, goToChat]);

  const handleDeleteChat = useCallback(
    (id: string) => {
      deleteChat(id);
      if (id === chatId) {
        goToChat(createChat());
      }
    },
    [chatId, deleteChat, createChat, goToChat]
  );

  return (
    <div>
      <PopoverPrimitives.Root defaultOpen={false}>
        <PopoverPrimitives.Trigger asChild>
          <button
            className="flex size-14 items-center border border-neutral-200 justify-center rounded-full bg-white hover:bg-neutral-50 shadow-[0px_36px_49px_0px_rgba(0,0,0,0.01),0px_15.04px_20.471px_0px_rgba(0,0,0,0.01),0px_8.041px_10.945px_0px_rgba(0,0,0,0.01),0px_4.508px_6.136px_0px_rgba(0,0,0,0.00),0px_2.394px_3.259px_0px_rgba(0,0,0,0.00),0px_0.996px_1.356px_0px_rgba(0,0,0,0.00)] transition-all fixed bottom-8 right-8 z-40 duration-200"
            aria-label="Abrir asistente IA"
          >
            <SparklesIcon className="fill-[#0b1b3b] size-7" />
          </button>
        </PopoverPrimitives.Trigger>
        <PopoverPrimitives.Portal>
          <PopoverPrimitives.Content
            sideOffset={16}
            side="top"
            align="end"
            onInteractOutside={(e) => e.preventDefault()}
            className="fixed bottom-0 right-0 z-50 h-[700px] max-h-[75vh] w-[420px] max-w-[90vw] overflow-hidden rounded-xl ring-1 ring-neutral-200 bg-neutral-50 shadow-[0px_36px_49px_0px_rgba(0,0,0,0.01),0px_15.04px_20.471px_0px_rgba(0,0,0,0.01),0px_8.041px_10.945px_0px_rgba(0,0,0,0.01),0px_4.508px_6.136px_0px_rgba(0,0,0,0.00),0px_2.394px_3.259px_0px_rgba(0,0,0,0.00),0px_0.996px_1.356px_0px_rgba(0,0,0,0.00)] will-change-[transform,opacity]"
          >
            <div className="relative flex h-full w-full flex-col gap-1">
              {/* Header */}
              <div className="flex h-11 shrink-0 items-center justify-between px-4 pt-4">
                {!showListing && (
                  <button
                    onClick={() => setShowListing(true)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium hover:bg-neutral-100 truncate"
                  >
                    <ChevronLeftIcon className="size-4 opacity-70 -ml-1 shrink-0 grow-0" />
                    <span>Chats</span>
                  </button>
                )}
                <span className="ml-auto flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleNewChat}
                    className="flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium hover:bg-neutral-100"
                  >
                    <PlusIcon className="size-4 -ml-1 opacity-70" />
                    <span>Nuevo chat</span>
                  </button>
                  <PopoverPrimitives.Close className="bg-neutral-50 hover:bg-neutral-100 flex size-8 items-center justify-center rounded-full">
                    <span className="sr-only">Cerrar</span>
                    <CloseIcon className="size-4 opacity-70" />
                  </PopoverPrimitives.Close>
                </span>
              </div>

              {/* Body */}
              <div className="relative flex-grow min-h-0">
                {showListing ? (
                  <ChatListing
                    chats={chats}
                    onSelectChat={goToChat}
                    onDeleteChat={handleDeleteChat}
                  />
                ) : (
                  <Chat chatId={chatId} onUpdateMeta={updateChatMeta} />
                )}
              </div>
            </div>
          </PopoverPrimitives.Content>
        </PopoverPrimitives.Portal>
      </PopoverPrimitives.Root>
    </div>
  );
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

function Chat({
  chatId,
  onUpdateMeta,
}: {
  chatId: string;
  onUpdateMeta: (
    id: string,
    patch: Partial<Pick<ChatMeta, "title" | "lastMessageAt">>
  ) => void;
}) {
  const { messages, appendMessages } = useChatMessages(chatId);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ── MASTRA INTEGRATION POINT ──────────────────────────────────────────────
  //
  // This is where you connect to your Mastra agent. Steps:
  //
  // 1. Install the client SDK:
  //      npm install @mastra/client-js
  //
  // 2. Add to your .env.local:
  //      NEXT_PUBLIC_MASTRA_SERVER_URL=http://localhost:4111
  //
  // 3. Create a Mastra client (e.g. in src/lib/mastra.ts):
  //      import { MastraClient } from "@mastra/client-js";
  //      export const mastra = new MastraClient({
  //        baseUrl: process.env.NEXT_PUBLIC_MASTRA_SERVER_URL!,
  //      });
  //
  // 4. Replace the STUB block below with a real agent call:
  //
  //    Non-streaming:
  //      const agent = mastra.getAgent("observaPeruAgent");
  //      const result = await agent.generate({
  //        messages: [...messages, { role: "user", content }],
  //        threadId: chatId,   // enables Mastra Memory persistence
  //        resourceId: userId, // ties memory to a specific user
  //      });
  //      assistantContent = result.text;
  //
  //    Streaming (recommended — update a partial message as chunks arrive):
  //      const stream = await agent.stream({
  //        messages: [...messages, { role: "user", content }],
  //        threadId: chatId,
  //      });
  //      for await (const chunk of stream.textStream) {
  //        setPartialReply((prev) => prev + chunk);
  //      }
  // ─────────────────────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) return;

      const userMessage: Message = {
        id: uid(),
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      appendMessages([userMessage]);
      onUpdateMeta(chatId, {
        // Auto-title the chat from the first user message
        ...(messages.length === 0 && { title: trimmed.slice(0, 50) }),
        lastMessageAt: userMessage.createdAt,
      });

      setIsLoading(true);
      try {
        // ── STUB: Replace this block with a real Mastra agent call ──────────
        await new Promise((resolve) => setTimeout(resolve, 800));
        const assistantContent =
          "Esta es una respuesta de prueba. Conecta un agente de Mastra para obtener respuestas reales sobre los candidatos.";
        // ───────────────────────────────────────────────────────────────────

        const assistantMessage: Message = {
          id: uid(),
          role: "assistant",
          content: assistantContent,
          createdAt: new Date().toISOString(),
        };

        appendMessages([assistantMessage]);
        onUpdateMeta(chatId, { lastMessageAt: assistantMessage.createdAt });
      } finally {
        setIsLoading(false);
      }
    },
    [chatId, messages, isLoading, appendMessages, onUpdateMeta]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Message area */}
      <div className="grow overflow-y-auto p-4 min-h-0">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col gap-5 justify-end pb-2">
            <h3 className="text-xl font-semibold">¿En qué te puedo ayudar?</h3>
            <div className="flex flex-wrap items-start gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  disabled={isLoading}
                  className="px-3.5 py-1.5 transition-colors rounded-full flex items-center gap-2 bg-white border border-neutral-200 text-sm font-medium shadow-sm hover:bg-neutral-50 disabled:opacity-50"
                  onClick={() => sendMessage(s.message)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-neutral-200 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-neutral-500">
                  <span className="animate-pulse">Pensando…</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-neutral-200 bg-white">
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 px-4 py-3"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
                setInput("");
              }
            }}
            placeholder="Pregúntame lo que sea"
            rows={1}
            disabled={isLoading}
            className="grow resize-none bg-transparent text-sm placeholder:text-neutral-400 focus:outline-none py-1.5 max-h-32 overflow-y-auto disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Enviar mensaje"
            className="shrink-0 flex size-8 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── MessageBubble ────────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-[#0b1b3b] text-white rounded-br-sm"
            : "bg-white border border-neutral-200 text-neutral-900 rounded-bl-sm"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

// ─── ChatListing ──────────────────────────────────────────────────────────────

function ChatListing({
  chats,
  onSelectChat,
  onDeleteChat,
}: {
  chats: ChatMeta[];
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}) {
  // MASTRA INTEGRATION POINT:
  // When replacing localStorage with Mastra Memory, drive loading / error
  // states from the hook that fetches threads and pass them as props here,
  // so this component can render a spinner or error message accordingly.

  if (chats.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-400">
        No hay chats aún
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col gap-2 overflow-auto p-4">
      <ul className="flex flex-col gap-3 text-sm pl-0">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className="group relative flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50"
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              <button
                onClick={() => onSelectChat(chat.id)}
                className="text-left font-medium before:absolute before:inset-0 truncate"
              >
                {chat.title || "Sin título"}
              </button>
              <div className="text-xs text-neutral-500">
                {new Date(
                  chat.lastMessageAt ?? chat.createdAt
                ).toLocaleString("es-PE", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
            <button
              onClick={() => onDeleteChat(chat.id)}
              className="relative hidden group-hover:flex shrink-0 ml-2"
              title="Eliminar chat"
            >
              <TrashIcon className="text-red-600 size-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CloseIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SparklesIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path d="M17.617 14.034c-4.172 1.378-5.561 2.768-6.94 6.94a.375.375 0 0 1-.711 0c-1.379-4.172-2.768-5.561-6.94-6.94a.375.375 0 0 1 0-.712c4.172-1.378 5.561-2.767 6.94-6.939a.375.375 0 0 1 .711 0c1.379 4.172 2.768 5.561 6.94 6.94a.375.375 0 0 1 0 .711ZM21.102 6.723c-2.085.689-2.78 1.384-3.47 3.47a.187.187 0 0 1-.356 0c-.688-2.085-1.383-2.78-3.47-3.47-.17-.056-.17-.298 0-.355 2.086-.689 2.781-1.384 3.47-3.47.057-.172.3-.172.356 0 .689 2.085 1.384 2.78 3.47 3.47.171.056.171.298 0 .355Z" />
    </svg>
  );
}

function PlusIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function ChevronLeftIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function TrashIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function SendIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22 11 13 2 9l20-7z" />
    </svg>
  );
}
