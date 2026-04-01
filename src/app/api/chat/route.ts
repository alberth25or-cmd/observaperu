import { convertToModelMessages, streamText, stepCountIs, UIMessage, tool } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { z } from "zod";
import { CANDIDATES_DETAIL } from "@/data/candidatos-detalle";
import { ALL_CANDIDATES } from "@/data/candidatos";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

const SYSTEM_PROMPT = `Eres el asistente de ObservaPeru, una plataforma de información electoral para las elecciones presidenciales del Perú 2026. Tu rol es ayudar a los ciudadanos a conocer, comparar y entender a los candidatos presidenciales de forma objetiva e imparcial.

Directrices:
- Responde siempre en español, de forma clara y concisa.
- Sé neutral y objetivo: no expreses preferencias ni hagas campaña a favor o en contra de ningún candidato.
- Cuando te pregunten sobre un candidato o quieran comparar candidatos, usa las herramientas disponibles para obtener información actualizada.
- Si necesitas saber qué candidatos están disponibles, usa primero listCandidates.
- No inventes datos. Si la información no está disponible en las herramientas, indícalo explícitamente.
- Para comparaciones, obtén los datos de cada candidato por separado usando las herramientas.`;

const keySchema = z.object({
  key: z
    .string()
    .describe(
      "Clave del candidato (ej: 'alfonso-lopez-chau-nava'). Usa listCandidates si no conoces la clave.",
    ),
});

function getDetail(key: string) {
  const detail = CANDIDATES_DETAIL[key];
  if (!detail) throw new Error(`Candidato '${key}' no encontrado.`);
  return detail;
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: deepseek("deepseek-chat"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      listCandidates: tool({
        description:
          "Lista todos los candidatos presidenciales disponibles con su clave, nombre y partido. Usa esta herramienta para descubrir qué candidatos existen antes de consultar su información detallada.",
        inputSchema: z.object({}),
        execute: async () =>
          ALL_CANDIDATES.map((c) => ({ key: c.key, name: c.name, party: c.party })),
      }),

      getCandidateBiografia: tool({
        description:
          "Obtiene la biografía general de un candidato: nombre, partido, edad y texto biográfico.",
        inputSchema: keySchema,
        execute: async (input) => {
          const detail = getDetail(input.key);
          const age = Math.floor(
            (Date.now() - new Date(detail.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25),
          );
          return { name: detail.name, party: detail.party, birthDate: detail.birthDate, age, biografia: detail.biografia };
        },
      }),

      getCandidateHistorialAcademico: tool({
        description: "Obtiene el historial académico y formación educativa de un candidato.",
        inputSchema: keySchema,
        execute: async (input) => {
          const detail = getDetail(input.key);
          return { name: detail.name, historialAcademico: detail.historialAcademico };
        },
      }),

      getCandidateControversias: tool({
        description:
          "Obtiene las controversias, antecedentes legales y observaciones registradas de un candidato.",
        inputSchema: keySchema,
        execute: async (input) => {
          const detail = getDetail(input.key);
          return { name: detail.name, controversias: detail.controversias };
        },
      }),

      getCandidateIdeologia: tool({
        description:
          "Obtiene la ideología política y posición en el espectro político (eje económico y social) de un candidato.",
        inputSchema: keySchema,
        execute: async (input) => {
          const detail = getDetail(input.key);
          const candidate = ALL_CANDIDATES.find((c) => c.key === input.key);
          return {
            name: detail.name,
            ideologiaPolitica: detail.ideologiaPolitica,
            posicionEconomica: candidate?.econLabel ?? null,
            posicionSocial: candidate?.socialLabel ?? null,
          };
        },
      }),

      getCandidateFinanciamiento: tool({
        description:
          "Obtiene la información de financiamiento, bienes declarados e ingresos de un candidato.",
        inputSchema: keySchema,
        execute: async (input) => {
          const detail = getDetail(input.key);
          return { name: detail.name, financiamiento: detail.financiamiento };
        },
      }),

      getCandidateExperiencia: tool({
        description: "Obtiene la experiencia profesional y trayectoria pública de un candidato.",
        inputSchema: keySchema,
        execute: async (input) => {
          const detail = getDetail(input.key);
          return { name: detail.name, experiencia: detail.experiencia };
        },
      }),

      getCandidateLogros: tool({
        description: "Obtiene los logros y hitos destacados en la trayectoria de un candidato.",
        inputSchema: keySchema,
        execute: async (input) => {
          const detail = getDetail(input.key);
          return { name: detail.name, logros: detail.logros };
        },
      }),

      getCandidatePropuestas: tool({
        description:
          "Obtiene las propuestas de gobierno y plan de acción de un candidato para el periodo 2026-2031.",
        inputSchema: keySchema,
        execute: async (input) => {
          const detail = getDetail(input.key);
          return { name: detail.name, propuestas: detail.propuestas };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
