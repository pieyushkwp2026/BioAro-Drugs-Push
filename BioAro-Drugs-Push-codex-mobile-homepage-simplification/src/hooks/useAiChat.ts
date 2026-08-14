import { useContext } from "react";
import { AiChatContext } from "../components/ask/chat-context";

export function useAiChat() {
  const context = useContext(AiChatContext);
  if (!context) throw new Error("useAiChat must be used inside AiChatProvider");
  return context;
}
