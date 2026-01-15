import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: any;
  }
}

type UseGoogleIdentityProps = {
  clientId?: string;
  onCredential: (idToken: string) => void;
  onError?: (message: string) => void;
};

/**
 * Loads Google Identity Services script and exposes a prompt trigger that returns an ID token.
 */
export function useGoogleIdentity({ clientId, onCredential, onError }: UseGoogleIdentityProps) {
  const [ready, setReady] = useState(false);
  const initialized = useRef(false);
  const credentialCallback = useRef(onCredential);
  const errorCallback = useRef(onError);

  useEffect(() => {
    credentialCallback.current = onCredential;
    errorCallback.current = onError;
  }, [onCredential, onError]);

  useEffect(() => {
    if (!clientId) {
      errorCallback.current?.("Google Sign-In is not configured.");
      return;
    }

    const initGoogle = () => {
      if (initialized.current || !window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: any) => {
          if (response?.credential) {
            credentialCallback.current(response.credential);
          } else {
            errorCallback.current?.("No credential returned from Google.");
          }
        },
        ux_mode: "popup",
        auto_select: false,
      });
      initialized.current = true;
      setReady(true);
    };

    if (window.google?.accounts?.id) {
      initGoogle();
      return;
    }

    const existingScript = document.getElementById("google-identity-script") as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener("load", initGoogle);
      existingScript.addEventListener("error", () => errorCallback.current?.("Failed to load Google Sign-In."));
      return () => {
        existingScript.removeEventListener("load", initGoogle);
      };
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.id = "google-identity-script";
    script.onload = initGoogle;
    script.onerror = () => errorCallback.current?.("Failed to load Google Sign-In.");
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [clientId]);

  const promptSignIn = () => {
    if (!ready || !window.google?.accounts?.id) {
      errorCallback.current?.("Google Sign-In is not ready yet.");
      return;
    }
    try {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification?.isNotDisplayed && notification.isNotDisplayed()) {
          const reason = notification.getNotDisplayedReason?.();
          errorCallback.current?.(
            reason
              ? `Google Sign-In was blocked: ${reason}`
              : "Google Sign-In was blocked. Please allow pop-ups or try again."
          );
        }
        if (notification?.isSkippedMoment && notification.isSkippedMoment()) {
          const reason = notification.getSkippedReason?.();
          errorCallback.current?.(
            reason
              ? `Google Sign-In was skipped: ${reason}`
              : "Google Sign-In was skipped. Please try again."
          );
        }
        if (notification?.isDismissedMoment && notification.isDismissedMoment()) {
          const reason = notification.getDismissedReason?.();
          if (reason === "credential_returned") return;
          errorCallback.current?.(
            reason ? `Google Sign-In was dismissed: ${reason}` : "Google Sign-In was dismissed."
          );
        }
      });
    } catch (e) {
      errorCallback.current?.("Google Sign-In failed to start. Please allow pop-ups and try again.");
    }
  };

  return { promptSignIn, ready };
}
