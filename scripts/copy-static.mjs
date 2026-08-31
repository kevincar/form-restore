import { cp, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

await mkdir("dist", { recursive: true });

if (existsSync("public")) {
  await cp("public", "dist", { recursive: true });
}

await mkdir("dist/popup", { recursive: true });
await cp("src/popup/popup.html", "dist/popup/popup.html");
await cp("src/popup/popup.css", "dist/popup/popup.css");
