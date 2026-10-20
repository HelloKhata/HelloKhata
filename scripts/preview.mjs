// Runs `next <command>` against .next-preview so a production preview never clashes with `next dev`.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const bin = require.resolve("next/dist/bin/next");
const child = spawn(process.execPath, [bin, ...process.argv.slice(2)], { stdio: "inherit", env: { ...process.env, NEXT_DIST_DIR: ".next-preview" } });
child.on("exit", (code) => process.exit(code ?? 0));
