// reCAPTCHA v2 Checkbox site key from environment
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

/**
 * Each mounted page gets its own widget state so multiple reCAPTCHA widgets
 * can coexist without stomping on one another.
 */
interface WidgetState {
  id: number | null;
  token: string | null;
}

const widgets = new Map<string, WidgetState>();
let scriptPromise: Promise<void> | null = null;

/**
 * Global callback invoked by Google when the checkbox challenge succeeds.
 * Because Google calls this on the global window we accept a single token and
 * assign it to every widget – in practice there is only one visible at a time.
 */
function recaptchaCallback(token: string) {
  for (const state of widgets.values()) {
    state.token = token;
  }
}

function recaptchaExpiredCallback() {
  for (const state of widgets.values()) {
    state.token = null;
  }
}

function recaptchaErrorCallback() {
  for (const state of widgets.values()) {
    state.token = null;
  }
  console.error('[reCAPTCHA] error callback fired');
}

(window as any).recaptchaCallback = recaptchaCallback;
(window as any).recaptchaExpiredCallback = recaptchaExpiredCallback;
(window as any).recaptchaErrorCallback = recaptchaErrorCallback;

function loadRecaptchaScript(): Promise<void> {
  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    // Already loaded?
    if (typeof window.grecaptcha !== 'undefined' && window.grecaptcha.render) {
      resolve();
      return;
    }

    // Script tag already present?
    const existing = document.querySelector('script[src*="recaptcha/api.js"]');
    if (existing) {
      const iv = setInterval(() => {
        if (typeof window.grecaptcha !== 'undefined' && window.grecaptcha.render) {
          clearInterval(iv);
          resolve();
        }
      }, 100);
      setTimeout(() => {
        clearInterval(iv);
        reject(new Error('reCAPTCHA script loading timeout'));
      }, 10000);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit&hl=ar';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      const iv = setInterval(() => {
        if (typeof window.grecaptcha !== 'undefined' && window.grecaptcha.render) {
          clearInterval(iv);
          resolve();
        }
      }, 100);
      setTimeout(() => {
        clearInterval(iv);
        if (!(typeof window.grecaptcha !== 'undefined' && window.grecaptcha.render)) {
          reject(new Error('reCAPTCHA script loaded but grecaptcha.render not available'));
        }
      }, 5000);
    };

    script.onerror = () => reject(new Error('Failed to load reCAPTCHA script'));
    document.head.appendChild(script);

    setTimeout(() => reject(new Error('reCAPTCHA script loading timeout')), 15000);
  });

  return scriptPromise;
}

/**
 * Renders a visible checkbox reCAPTCHA widget inside the given container.
 * Call this once inside useEffect.
 */
export async function renderRecaptchaWidget(containerId: string): Promise<void> {
  if (!RECAPTCHA_SITE_KEY) {
    console.error('[reCAPTCHA] VITE_RECAPTCHA_SITE_KEY is not configured');
    throw new Error('VITE_RECAPTCHA_SITE_KEY is not configured. Check your build environment.');
  }

  console.log('[reCAPTCHA] Loading script…');
  await loadRecaptchaScript();
  console.log('[reCAPTCHA] Script ready, waiting for container…');

  // Wait for the container (React might not have flushed to DOM yet)
  let container: HTMLElement | null = null;
  for (let i = 0; i < 50; i++) {
    container = document.getElementById(containerId);
    if (container) break;
    await new Promise(r => setTimeout(r, 100));
  }

  if (!container) {
    console.error(`[reCAPTCHA] Container #${containerId} not found`);
    throw new Error(`reCAPTCHA container #${containerId} not found`);
  }

  // Remove any previously rendered iframe inside this container
  const existing = widgets.get(containerId);
  if (existing?.id !== null) {
    try { window.grecaptcha.reset(existing.id!); } catch {}
  }
  widgets.delete(containerId);

  container.innerHTML = '';
  // Ensure container is visible
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.minHeight = '78px';
  container.style.minWidth = '304px';

  const inner = document.createElement('div');
  const innerId = `recaptcha-inner-${containerId}-${Date.now()}`;
  inner.id = innerId;
  container.appendChild(inner);

  try {
    console.log('[reCAPTCHA] Calling grecaptcha.render…');
    const widgetId = window.grecaptcha.render(innerId, {
      sitekey: RECAPTCHA_SITE_KEY,
      size: 'normal',
      theme: 'light',
      callback: recaptchaCallback,
      'expired-callback': recaptchaExpiredCallback,
      'error-callback': recaptchaErrorCallback,
    });

    widgets.set(containerId, { id: widgetId, token: null });
    console.log(`[reCAPTCHA] Widget rendered, widgetId=${widgetId}`);
  } catch (err: any) {
    console.error('[reCAPTCHA] render() threw:', err);
    container.innerHTML = `
      <div style="padding:12px;border:1px solid #f5c6cb;background:#f8d7da;color:#721c24;border-radius:4px;font-size:14px;text-align:center;">
        ⚠️ reCAPTCHA configuration error.<br/>
        The site key may not support checkbox mode.<br/>
        Please use a v2 Checkbox key.
      </div>`;
    throw err;
  }
}

/** Returns the current reCAPTCHA token or null. */
export function getRecaptchaToken(): string | null {
  for (const state of widgets.values()) {
    if (state.token) return state.token;
  }
  return null;
}

/** Resets every widget so the user can verify again. */
export function resetRecaptchaWidget(): void {
  for (const [containerId, state] of widgets.entries()) {
    if (state.id !== null) {
      try { window.grecaptcha.reset(state.id); } catch {}
    }
    state.token = null;
  }
}

/** Destroys the widget tied to a specific container (useEffect cleanup). */
export function destroyRecaptchaWidget(containerId: string): void {
  const state = widgets.get(containerId);
  if (state?.id !== null) {
    try { window.grecaptcha.reset(state.id!); } catch {}
  }
  widgets.delete(containerId);

  const container = document.getElementById(containerId);
  if (container) container.innerHTML = '';
}

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    grecaptcha: {
      render: (id: string, options: Record<string, any>) => number;
      reset: (id?: number) => void;
    };
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
