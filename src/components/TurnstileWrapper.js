// src/components/TurnstileWrapper.js
import { useEffect } from 'react';

export default function TurnstileWrapper({ onVerify, siteKey }) {
  useEffect(() => {
    // Inject Turnstile script once
    if (!document.getElementById('cf-turnstile-script')) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.id = 'cf-turnstile-script';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    // Common callback
    window.turnstileCallback = (token) => {
      onVerify(token);
    };
  }, [onVerify]);

  return (
    <div
      className="cf-turnstile"
      data-sitekey={siteKey}
      data-callback="turnstileCallback"
    />
  );
}
