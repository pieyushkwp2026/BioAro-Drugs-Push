/*
 * Whether the dashboard may render demonstration data.
 *
 * Two conditions, and both must hold. The flag is the intent; the hostname check is
 * the backstop for the case the flag cannot cover — someone setting the environment
 * variable on the production project by accident, or a preview configuration being
 * promoted. On the live domain this returns false whatever the environment says, so
 * the worst outcome of a mistake is an empty dashboard rather than a fabricated
 * order history in front of a customer.
 *
 * Host-based rather than `import.meta.env.DEV`, because the whole point is that the
 * client can click through this on a deployed preview URL.
 *
 * IF THE PRODUCTION HOSTNAME BELOW IS WRONG, THIS CHECK SILENTLY PERMITS DEMONSTRATION
 * DATA ON THE LIVE SITE. Confirm it against the deployed domain before launch and keep
 * it in step with any domain change.
 */
const PRODUCTION_HOSTS = new Set(["bioarodrugs.com", "www.bioarodrugs.com"]);

export function isDemoDataEnabled(): boolean {
  if (import.meta.env.VITE_MEMBER_DEMO_DATA !== "true") return false;
  if (typeof window === "undefined") return false;
  return !PRODUCTION_HOSTS.has(window.location.hostname);
}
