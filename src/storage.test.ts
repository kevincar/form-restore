import { describe, expect, it } from "vitest";
import { getPageData, saveFieldChange, type LocalStorageArea } from "./storage.js";

const createMemoryStorage = (initialData: Record<string, unknown> = {}): LocalStorageArea => {
  const data = { ...initialData };

  return {
    get: (keys, callback) => {
      if (typeof keys === "string") {
        callback({ [keys]: data[keys] });
        return;
      }

      callback(data);
    },
    set: (items, callback) => {
      Object.assign(data, items);
      callback?.();
    }
  };
};

describe("storage", () => {
  it("saves field changes under URL, modal, and field keys", async () => {
    const storage = createMemoryStorage();

    const savedData = await saveFieldChange(storage, "https://example.com/patient", "Vitals", "height", "72");

    expect(savedData).toEqual({
      "https://example.com/patient": {
        Vitals: {
          height: "72"
        }
      }
    });
  });

  it("merges new changes without removing existing modal snapshots", async () => {
    const storage = createMemoryStorage();

    await saveFieldChange(storage, "https://example.com/patient", "Vitals", "height", "72");
    await saveFieldChange(storage, "https://example.com/patient", "Vitals", "weight", "180");
    await saveFieldChange(storage, "https://example.com/patient", "Allergies", "has-allergies", true);

    await expect(getPageData(storage, "https://example.com/patient")).resolves.toEqual({
      Vitals: {
        height: "72",
        weight: "180"
      },
      Allergies: {
        "has-allergies": true
      }
    });
  });
});
