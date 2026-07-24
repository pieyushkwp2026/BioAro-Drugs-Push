import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleCallback } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      setError("Sign-in was cancelled or denied.");
      return;
    }

    if (!code || !state) {
      setError("Missing sign-in details. Please try again.");
      return;
    }

    void (async () => {
      try {
        const returnTo = await handleCallback(code, state);
        navigate(returnTo, { replace: true });
      } catch {
        setError("Sign-in failed. Please try again.");
      }
    })();
  }, [handleCallback, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        {error ? (
          <>
            <h1 className="text-2xl font-semibold">Sign-in failed</h1>
            <p className="text-muted-foreground">{error}</p>
            <a href="/auth" className="underline">
              Try again
            </a>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold">Signing you in...</h1>
            <p className="text-muted-foreground">Please wait a moment.</p>
          </>
        )}
      </div>
    </div>
  );
}