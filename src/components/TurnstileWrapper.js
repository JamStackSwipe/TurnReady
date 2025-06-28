// src/components/TurnstileWrapper.js
import React, { useEffect, useRef } from 'react';

const TurnstileWrapper = ({ onVerify }) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const siteKey = '0x4AAAAAABiwQGcdykSxvgHa'; // ✅ LIVE TurnReady site key

  useEffect(() => {
    const renderTurnstile = () => {
      if (
        window.turnstile &&
        containerRef.current &&
        widgetIdRef.current === null
      ) {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => {
            if (typeof onVerify === 'function') {
              onVerify(token);
            }
          },
          size: 'invisible',
          theme: 'light',
        });

        window.turnstile.execute(widgetIdRef.current);
      }
    };

    // Inject Turnstile script only once
    if (!document.getElementById('cf-turnstile-script')) {
      const script = document.createElement('script');
      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
      script.id = 'cf-turnstile-script';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      window.onTurnstileLoad = renderTurnstile;
    } else {
      renderTurnstile();
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        widgetIdRef.current = null;
      }
    };
  }, [onVerify]);

  return <div ref={containerRef} />;
};

export default TurnstileWrapper;
