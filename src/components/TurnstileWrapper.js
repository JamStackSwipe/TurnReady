// src/components/TurnstileWrapper.js
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

const TurnstileWrapper = forwardRef(({ siteKey, onVerify }, ref) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  useImperativeHandle(ref, () => ({
    execute: () => {
      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.execute(widgetIdRef.current);
      }
    },
  }));

  useEffect(() => {
    const renderWidget = () => {
      if (window.turnstile && containerRef.current && widgetIdRef.current === null) {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => {
            if (typeof onVerify === 'function') {
              onVerify(token);
            }
          },
          size: 'invisible',
        });
      }
    };

    if (!document.getElementById('cf-turnstile-script')) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
      script.id = 'cf-turnstile-script';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      window.onTurnstileLoad = renderWidget;
    } else {
      renderWidget();
    }

    return () => {
      if (widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onVerify]);

  return <div ref={containerRef} />;
});

export default TurnstileWrapper;
