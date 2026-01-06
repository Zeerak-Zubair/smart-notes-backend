import fs from "fs";
import { swaggerSpec } from "./swagger";

fs.mkdirSync("docs", { recursive: true });

fs.writeFileSync(
  "docs/openapi.json",
  JSON.stringify(swaggerSpec, null, 2)
);
