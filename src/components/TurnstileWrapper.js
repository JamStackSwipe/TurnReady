// src/components/TurnstileWrapper.js
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

const TurnstileWrapper = forwardRef(({ onVerify, siteKey }, ref) => {
  const divRef = useRef(null);
  const widgetIdRef = useRef(null);

  useImperativeHandle(ref, () => ({
    execute: () => {
      if (window.turnstile && widgetIdRef.current !== null) {
        try {
          window.turnstile.execute(widgetIdRef.current);
        } catch (err) {
          // If it's already executing, reset then retry
          window.turnstile.reset(widgetIdRef.current);
          setTimeout(() => {
            window.turnstile.execute(widgetIdRef.current);
          }, 100);
        }
      }
    },
  }));

  useEffect(() => {
    const renderTurnstile = () => {
      if (window.turnstile && divRef.current && widgetIdRef.current === null) {
        widgetIdRef.current = window.turnstile.render(divRef.current, {
          sitekey: siteKey,
          callback: (token) => {
            if (typeof onVerify === 'function') {
              onVerify(token);
            }
          },
          size: 'invisible',
        });
      } else {
        setTimeout(renderTurnstile, 100);
      }
    };

    // Load script once
    if (!document.getElementById('cf-turnstile-script')) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.id = 'cf-turnstile-script';
      script.async = true;
      script.defer = true;
      script.onload = renderTurnstile;
      document.body.appendChild(script);
    } else {
      renderTurnstile();
    }
  }, [onVerify, siteKey]);

  return <div ref={divRef} />;
});

export default TurnstileWrapper;
