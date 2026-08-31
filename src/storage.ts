import type { FieldValue, ModalSnapshots, SavedData } from "./types.js";

const STORAGE_KEY = "modmed.savedData";

export interface LocalStorageArea {
  get: (keys: string | string[] | Record<string, unknown> | null, callback: (items: Record<string, unknown>) => void) => void;
  set: (items: Record<string, unknown>, callback?: () => void) => void;
}

export const emptySavedData = (): SavedData => ({});

export const getSavedData = (storage: LocalStorageArea): Promise<SavedData> =>
  new Promise((resolve) => {
    storage.get(STORAGE_KEY, (items) => {
      const savedData = items[STORAGE_KEY];
      resolve(isSavedData(savedData) ? savedData : emptySavedData());
    });
  });

export const setSavedData = (storage: LocalStorageArea, savedData: SavedData): Promise<void> =>
  new Promise((resolve) => {
    storage.set({ [STORAGE_KEY]: savedData }, () => resolve());
  });

export const saveFieldChange = async (
  storage: LocalStorageArea,
  url: string,
  modalName: string,
  fieldId: string,
  value: FieldValue
): Promise<SavedData> => {
  const savedData = await getSavedData(storage);
  const nextSavedData: SavedData = {
    ...savedData,
    [url]: {
      ...(savedData[url] ?? {}),
      [modalName]: {
        ...(savedData[url]?.[modalName] ?? {}),
        [fieldId]: value
      }
    }
  };

  await setSavedData(storage, nextSavedData);
  return nextSavedData;
};

export const getPageData = async (storage: LocalStorageArea, url: string): Promise<ModalSnapshots> => {
  const savedData = await getSavedData(storage);
  return savedData[url] ?? {};
};

const isSavedData = (value: unknown): value is SavedData => {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every((modalSnapshots) => {
    if (!isRecord(modalSnapshots)) {
      return false;
    }

    return Object.values(modalSnapshots).every((formSnapshot) => {
      if (!isRecord(formSnapshot)) {
        return false;
      }

      return Object.values(formSnapshot).every((fieldValue) => typeof fieldValue === "string" || typeof fieldValue === "boolean");
    });
  });
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
