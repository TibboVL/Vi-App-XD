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

  // run a
  // db reverse tcp:3100 tcp:3100
  // to forward port to backend on the device
  const isPhysicalDevice = false;

  return {
    ...config,
    extra: {
      apiUrl: isPhysicalDevice ? env.API_URL_PHYSICAL : env.API_URL,
    },
  };
};
