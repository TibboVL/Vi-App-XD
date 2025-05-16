import "dotenv/config"; // loads .env by default if present
import * as dotenv from "dotenv";
import { resolve } from "path";

export default ({ config }) => {
  // Determine which env file to load depending on NODE_ENV
  const envFile =
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development";

  // Load env variables manually
  const env = dotenv.config({ path: resolve(__dirname, envFile) }).parsed;

  return {
    ...config,
    extra: {
      apiUrl: env.API_URL,
    },
  };
};
