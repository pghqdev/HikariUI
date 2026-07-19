export type HikarionTone = "accent" | "success" | "warning" | "danger";

export interface HikarionToastOptions {
  variant?: HikarionTone;
  duration?: number;
  closable?: boolean;
}

export interface HikarionApi {
  init(root?: ParentNode): void;
  /** Returns a dismiss function that closes the toast early. */
  toast(message: string, options?: HikarionToastOptions): () => void;
  setTheme(name: string): void;
}

declare global {
  interface Window {
    Hikarion: HikarionApi;
  }

  // eslint-disable-next-line no-var
  var Hikarion: HikarionApi;
}

export {};
