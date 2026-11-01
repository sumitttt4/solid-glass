import * as React from "react"
import { AiIdeaIcon, CodeIcon, Mail01Icon, Calendar03Icon } from "@hugeicons/core-free-icons"

import { ChatWindow } from "@/components/ui/chat-window"
import { DEMO_MODELS, demoRespond } from "@/lib/demo-ai"

export default function ChatWindowDemo() {
  const [model, setModel] = React.useState("aurora-pro")
  return (
    <ChatWindow
      respond={demoRespond}
      models={DEMO_MODELS}
      model={model}
      onModelChange={setModel}
      suggestions={[
        { title: "Explain glass materials", description: "When to use glass vs. solid", icon: AiIdeaIcon },
        { title: "Write a follow-up email", description: "Short, friendly, clear ask", icon: Mail01Icon },
        { title: "Plan my week", description: "Three steps, nothing more", icon: Calendar03Icon },
        { title: "Show me the code", description: "Wire up your own model", icon: CodeIcon },
      ]}
    />
  )
}
