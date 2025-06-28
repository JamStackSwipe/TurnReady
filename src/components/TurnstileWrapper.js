// src/components/TurnstileWrapper.js
import { useEffect, useRef } from 'react';

export default function TurnstileWrapper({ onVerify, siteKey }) {
  const divRef = useRef(null);

  useEffect(() => {
    // Load Turnstile script only once
    if (!document.getElementById('cf-turnstile-script')) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.id = 'cf-turnstile-script';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    // Setup global callback
    window.turnstileCallback = (token) => {
      if (onVerify) onVerify(token);
    };

    // Render the widget
    const tryRender = () => {
      if (window.turnstile && divRef.current) {
        window.turnstile.render(divRef.current, {
          sitekey: siteKey,
          callback: 'turnstileCallback',
        });
      } else {
        setTimeout(tryRender, 100);
      }
    };

    tryRender();
  }, [onVerify, siteKey]);

  return <div ref={divRef} className="my-2" />;
}
