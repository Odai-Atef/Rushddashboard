import { useCallback, useRef } from 'react';

// reCAPTCHA v2 Invisible site key from environment
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

// Mutable promise resolvers for the global callback
let resolveToken: ((token: string) => void) | null = null;
let rejectToken: ((err: Error) => void) | null = null;
let widgetId: number | null = null;
let widgetElement: HTMLDivElement | null = null;

/**
 * Global callback invoked by Google when the invisible challenge succeeds.
 */
function recaptchaCallback(token: string) {
  if (resolveToken) {
    resolveToken(token);
    resolveToken = null;
    rejectToken = null;
  }
}

function recaptchaExpiredCallback() {
  if (rejectToken) {
    rejectToken(new Error('reCAPTCHA expired'));
    resolveToken = null;
    rejectToken = null;
  }
}

function recaptchaErrorCallback() {
  if (rejectToken) {
    rejectToken(new Error('reCAPTCHA verification failed'));
    resolveToken = null;
    rejectToken = null;
  }
}

/**
 * Expose callbacks on window so reCAPTCHA v2 data-callback attributes can reach them.
 */
(window as any).recaptchaCallback = recaptchaCallback;
(window as any).recaptchaExpiredCallback = recaptchaExpiredCallback;
(window as any).recaptchaErrorCallback = recaptchaErrorCallback;

function createWidgetElement(): HTMLDivElement {
  if (widgetElement) return widgetElement;

  const div = document.createElement('div');
  div.id = 'recaptcha-invisible-widget';
  div.className = 'g-recaptcha';
  div.style.display = 'none';
  div.setAttribute('data-sitekey', RECAPTCHA_SITE_KEY || '');
  div.setAttribute('data-size', 'invisible');
  div.setAttribute('data-callback', 'recaptchaCallback');
  div.setAttribute('data-expired-callback', 'recaptchaExpiredCallback');
  div.setAttribute('data-error-callback', 'recaptchaErrorCallback');
  document.body.appendChild(div);
  widgetElement = div;
  return div;
}

/**
 * Loads the Google reCAPTCHA v2 script dynamically if not already loaded.
 * Uses explicit rendering (v2 Invisible).
 */
function loadRecaptchaScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.grecaptcha && window.grecaptcha.render) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
    script.async = true;
    script.defer = true;

    (window as any).onRecaptchaLoad = () => {
      resolve();
    };

    script.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
    document.head.appendChild(script);
  });
}

function renderWidget(): number {
  if (widgetId !== null) return widgetId;

  const element = createWidgetElement();

  widgetId = window.grecaptcha.render(element.id, {
    sitekey: RECAPTCHA_SITE_KEY,
    size: 'invisible',
    callback: recaptchaCallback,
    'expired-callback': recaptchaExpiredCallback,
    'error-callback': recaptchaErrorCallback,
  });

  return widgetId;
}

/**
 * Executes reCAPTCHA v2 Invisible and returns the token.
 */
export async function executeRecaptcha(_action: string = 'submit'): Promise<string> {
  if (!RECAPTCHA_SITE_KEY) {
    throw new Error(
      'VITE_RECAPTCHA_SITE_KEY is not configured. Check your build environment.'
    );
  }

  await loadRecaptchaScript();
  const id = renderWidget();

  return new Promise((resolve, reject) => {
    resolveToken = resolve;
    rejectToken = reject;
    window.grecaptcha.execute(id);
  });
}

// Extend Window interface for grecaptcha v2
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    grecaptcha: {
      render: (id: string, options: Record<string, any>) => number;
      execute: (id: number) => void;
      reset: (id: number) => void;
      ready?: (callback: () => void) => void;
    };
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
