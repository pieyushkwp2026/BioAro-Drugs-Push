import { useContext } from "react";
import { ProtocolSessionContext, type ProtocolSessionValue } from "../components/protocol/session-context";

/** The one protocol session, shared by the homepage modal and the /quiz page. */
export function useProtocolSession(): ProtocolSessionValue {
  const value = useContext(ProtocolSessionContext);

  if (!value) {
    throw new Error("useProtocolSession must be used inside ProtocolSessionProvider (mounted in Layout).");
  }

  return value;
}
