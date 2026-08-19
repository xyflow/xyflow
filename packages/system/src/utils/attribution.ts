import { isDomNodeVisible } from './general';

let warned = false;

export function handleAttributionWarning(library: 'react' | 'svelte' | 'vue') {
  if (warned || process.env.NODE_ENV !== 'development') {
    return;
  }
  warned = true;
  const framework = `${library.charAt(0).toUpperCase() + library.slice(1)} Flow`;

  setTimeout(() => {
    if (!isDomNodeVisible(`.${library}-flow__attribution`)) {
      console.warn(
        `${framework}: It seems like you are hiding the attribution. Please only do this when you are subscribed to ${framework} Pro: https://${library}flow.dev/remove-attribution?utm_source=console\n%cYou can ignore this warning if you are subscribed.`,
        'font-style: italic;'
      );
    }
  }, 1000);
}
