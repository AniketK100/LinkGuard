import posthog from 'posthog-js';

export const initPostHog = () => {
  const apiKey = import.meta.env.VITE_POSTHOG_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST || '/ingest';

  if (!apiKey) {
    // PostHog key not set locally; skip init gracefully without breaking build or runtime
    return;
  }

  try {
    posthog.init(apiKey, {
      api_host: host.startsWith('http') ? host : `${window.location.origin}${host.startsWith('/') ? host : '/' + host}`,
      ui_host: 'https://us.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      session_recording: {
        maskAllInputs: true,
        maskInputOptions: {
          password: true,
        },
      },
      loaded: (ph) => {
        ph.register({ site: 'linkguard' });
      },
    });
  } catch (err) {
    // Non-blocking initialization error handler
    console.warn('[PostHog] Initialization error:', err);
  }
};

export const trackEvent = (eventName, properties = {}) => {
  if (posthog.__loaded) {
    posthog.capture(eventName, {
      site: 'linkguard',
      ...properties,
    });
  }
};

export default posthog;
