import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
// הערה: משתמשים ב-import.meta.url + fileURLToPath במקום __dirname/path,
// כי הפרויקט הוא ESM טהור ("type": "module" ב-package.json) ו-__dirname
// אינו קיים במודולי ESM. זה גם נמנע מהצורך ב-@types/node לצורך ה-alias
// עצמו (path עדיין דורש @types/node ל-typecheck, ולכן הוספנו אותו
// כ-devDependency בכל מקרה - ראו package.json).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
});
