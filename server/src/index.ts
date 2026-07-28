import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { createApp } from "./app.js";

async function main() {
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`✓ API listening on http://localhost:${env.PORT}`);
  });
  await connectDatabase();
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
