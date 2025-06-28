// src/components/TurnstileWrapper.js
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

const TurnstileWrapper = forwardRef(({ onVerify, siteKey }, ref) => {
  const divRef = useRef(null);
  const widgetIdRef = useRef(null);

  useImperativeHandle(ref, () => ({
    execute: () => {
      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.execute(widgetIdRef.current);
      }
    },
  }));

  useEffect(() => {
    // Inject Turnstile script only once
    if (!document.getElementById('cf-turnstile-script')) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.id = 'cf-turnstile-script';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    // Define global callback
    window.turnstileCallback = function (token) {
      if (typeof onVerify === 'function') {
        onVerify(token);
      }
    };

    // Poll for render-ready and mount invisible widget
    const tryRender = () => {
      if (window.turnstile && divRef.current) {
        widgetIdRef.current = window.turnstile.render(divRef.current, {
          sitekey: siteKey, // ✅ correct camelCase use
          callback: 'turnstileCallback',
          size: 'invisible',
        });
      } else {
        setTimeout(tryRender, 100);
      }
    };

    tryRender();
  }, [onVerify, siteKey]);

  return <div ref={divRef} />;
});

export default TurnstileWrapper;
