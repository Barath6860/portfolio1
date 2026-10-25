export const THEME_STORAGE_KEY = "theme";

/**
 * Inlined in <head> so the saved theme applies before first paint (no flash).
 * Lives outside the "use client" theme module so the server layout receives
 * the actual string rather than a client reference.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");document.documentElement.dataset.theme=t==="light"?"light":"dark";}catch(e){document.documentElement.dataset.theme="dark";}})();`;
