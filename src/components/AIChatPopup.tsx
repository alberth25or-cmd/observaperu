"use client";

import * as PopoverPrimitives from "@radix-ui/react-popover";
import { useChat } from "@ai-sdk/react";
import { ComponentProps, FormEvent, useEffect, useRef, useState } from "react";

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

// ─── Root export ──────────────────────────────────────────────────────────────

export default function AIChatPopup() {
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
              <div className="flex h-11 shrink-0 items-center justify-end px-4 pt-4">
                <PopoverPrimitives.Close className="bg-neutral-50 hover:bg-neutral-100 flex size-8 items-center justify-center rounded-full">
                  <span className="sr-only">Cerrar</span>
                  <CloseIcon className="size-4 opacity-70" />
                </PopoverPrimitives.Close>
              </div>

              {/* Body */}
              <div className="relative flex-grow min-h-0">
                <Chat />
              </div>
            </div>
          </PopoverPrimitives.Content>
        </PopoverPrimitives.Portal>
      </PopoverPrimitives.Root>
    </div>
  );
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

function Chat() {
  const { messages, status, sendMessage } = useChat();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  // Extract text content from message parts
  const getMessageContent = (msg: (typeof messages)[number]): string => {
    return msg.parts
      .filter(
        (part): part is { type: "text"; text: string } => part.type === "text",
      )
      .map((part) => part.text)
      .join("");
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
                  onClick={() => handleSend(s.message)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={getMessageContent(msg)}
              />
            ))}
            {status === "submitted" && (
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
                handleSend(input);
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

function MessageBubble({ role, content }: { role: string; content: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-[#0b1b3b] text-white rounded-br-sm"
            : "bg-white border border-neutral-200 text-neutral-900 rounded-bl-sm"
        }`}
      >
        {content}
      </div>
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
