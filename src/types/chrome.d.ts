declare const chrome: {
  runtime: {
    lastError?: { message?: string };
    onMessage: {
      addListener: (
        callback: (
          message: unknown,
          sender: unknown,
          sendResponse: (response?: unknown) => void
        ) => boolean | void
      ) => void;
    };
    sendMessage: (message: unknown, callback?: (response: unknown) => void) => void;
  };
  storage: {
    local: {
      get: (keys: string | string[] | Record<string, unknown> | null, callback: (items: Record<string, unknown>) => void) => void;
      set: (items: Record<string, unknown>, callback?: () => void) => void;
    };
  };
  tabs: {
    query: (queryInfo: { active: boolean; currentWindow: boolean }, callback: (tabs: Array<{ id?: number; url?: string }>) => void) => void;
    sendMessage: (tabId: number, message: unknown, callback?: (response: unknown) => void) => void;
  };
};
