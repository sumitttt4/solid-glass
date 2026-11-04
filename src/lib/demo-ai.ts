import type { ModelOption } from "@/components/ui/model-picker"

/** Sample data for the AI examples. Model names are fictional placeholders. */
export const DEMO_MODELS: ModelOption[] = [
  { id: "aurora-pro", name: "Aurora Pro", provider: "Glaze Labs", description: "Most capable. Deep reasoning, long documents, careful code.", tags: ["Reasoning", "Vision"], context: 1_000_000, color: "oklch(0.54 0.22 277)" },
  { id: "aurora-flash", name: "Aurora Flash", provider: "Glaze Labs", description: "Fast and inexpensive for everyday tasks.", tags: ["Fast"], context: 200_000, color: "oklch(0.6 0.2 300)" },
  { id: "nimbus-4", name: "Nimbus 4", provider: "Open Weights", description: "Open model you can host yourself.", tags: ["Open", "Fast"], context: 128_000, color: "oklch(0.55 0.15 165)" },
  { id: "nimbus-4-code", name: "Nimbus 4 Code", provider: "Open Weights", description: "Tuned for code completion and refactors.", tags: ["Code"], context: 128_000, color: "oklch(0.6 0.13 200)" },
  { id: "echo-voice", name: "Echo Voice", provider: "Realtime", description: "Speech in, speech out, low latency.", tags: ["Audio", "Realtime"], context: 32_000, color: "oklch(0.65 0.18 40)" },
]

const ANSWERS: [RegExp, string][] = [
  [/glass|material|frost|aurora/i, "Glass works best with something behind it: a soft gradient, a photo, or light that moves. Set data-material=\"glass\" on the page, or on just one section, and every component inside takes the finish. Keep long text on the thicker panes so it stays easy to read."],
  [/email|write|draft/i, "Here's a short draft:\n\nHi Maya,\n\nThanks for the walkthrough today. I've attached the updated designs with the glass material applied. Could you take a look before Thursday's review?\n\nBest,\nSam"],
  [/plan|trip|week/i, "A simple plan:\n\n1. Monday: settle the scope and the three things that matter most.\n2. Midweek: build the smallest version end to end.\n3. Friday: show it to someone, write down what confused them, fix the top issue."],
  [/code|react|component/i, "Install one component and use it like any other:\n\nnpx shadcn@latest add sumitttt4/glazeui/chat-window#main\n\n<ChatWindow respond={async (messages) => callYourModel(messages)} />\n\nReturn a string, or an async iterable of chunks to stream."],
]

/** A pretend model: picks an answer by keyword, after a short think. */
export async function demoRespond(messages: { content: string }[]) {
  const last = messages[messages.length - 1]?.content ?? ""
  await new Promise((r) => setTimeout(r, 900))
  return ANSWERS.find(([re]) => re.test(last))?.[1] ?? "Good question. In a real app this is where your model's answer streams in. Hook up any API by returning its text, or an async iterable of chunks, from the respond function."
}
