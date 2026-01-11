import fs from "fs";
import { swaggerSpec } from "./swagger";

fs.mkdirSync("docs", { recursive: true });

// Write YAML
const yaml = require('yaml');
fs.writeFileSync("docs/openapi.yaml", yaml.stringify(swaggerSpec));

fs.writeFileSync(
  "docs/openapi.json",
  JSON.stringify(swaggerSpec, null, 2)
);
