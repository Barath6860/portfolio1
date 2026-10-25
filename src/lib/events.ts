/** Tiny cross-component events, so unrelated components avoid prop drilling. */

const OPEN_PALETTE = "open-command-palette";
const OPEN_PROJECT = "open-project";

export function openCommandPalette(): void {
  window.dispatchEvent(new Event(OPEN_PALETTE));
}

export function onOpenCommandPalette(handler: () => void): () => void {
  window.addEventListener(OPEN_PALETTE, handler);
  return () => window.removeEventListener(OPEN_PALETTE, handler);
}

export function openProject(slug: string): void {
  window.dispatchEvent(new CustomEvent<string>(OPEN_PROJECT, { detail: slug }));
}

export function onOpenProject(handler: (slug: string) => void): () => void {
  const listener = (e: Event) => handler((e as CustomEvent<string>).detail);
  window.addEventListener(OPEN_PROJECT, listener);
  return () => window.removeEventListener(OPEN_PROJECT, listener);
}
