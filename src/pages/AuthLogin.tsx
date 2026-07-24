import { useAuth } from "../hooks/useAuth";

export default function AuthLogin() {
  const { login, isLoading, error } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-semibold">Sign in to your account</h1>
        <p className="text-muted-foreground">
          Access your orders, saved details, and account preferences.
        </p>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={() => void login()}
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-primary-foreground font-medium disabled:opacity-60"
        >
          {isLoading ? "Redirecting..." : "Get Started"}
        </button>
      </div>
    </div>
  );
}