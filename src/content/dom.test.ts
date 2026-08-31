import { beforeEach, describe, expect, it } from "vitest";
import { getFieldId, getFieldValue, getModalName, pageKeyFromUrl, restoreFieldFromData } from "./dom.js";

describe("content DOM helpers", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
  });

  it("normalizes page URLs by removing hash fragments", () => {
    expect(pageKeyFromUrl("https://example.com/path?x=1#section")).toBe("https://example.com/path?x=1");
  });

  it("identifies fields by id, name, then aria-label", () => {
    document.body.innerHTML = `<input aria-label="Fallback label" />`;

    const input = document.querySelector("input");

    expect(input).not.toBeNull();
    expect(getFieldId(input as HTMLInputElement)).toBe("Fallback label");
  });

  it("reads checkbox values as booleans", () => {
    document.body.innerHTML = `<input id="accept" type="checkbox" checked />`;

    const input = document.querySelector("input");

    expect(input).not.toBeNull();
    expect(getFieldValue(input as HTMLInputElement)).toBe(true);
  });

  it("uses modal headings as modal names", () => {
    document.body.innerHTML = `
      <div role="dialog">
        <h2>Vitals</h2>
        <input id="height" />
      </div>
    `;

    const input = document.querySelector("input");

    expect(input).not.toBeNull();
    expect(getModalName(input as HTMLInputElement)).toBe("Vitals");
  });

  it("restores matching field values from modal data", () => {
    document.body.innerHTML = `
      <div role="dialog">
        <h2>Vitals</h2>
        <input id="height" />
      </div>
    `;

    const input = document.querySelector("input") as HTMLInputElement | null;

    expect(input).not.toBeNull();
    expect(restoreFieldFromData(input as HTMLInputElement, { Vitals: { height: "72" } })).toBe(true);
    expect(input?.value).toBe("72");
  });
});
