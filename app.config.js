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
    expo: {
      owner: "tvl01",
      ...config.expo,
      android: {
        ...config.expo?.android,
        package: "com.balance.vi", // Make sure this is explicitly set here
      },
      ios: {
        ...config.expo?.ios,
        bundleIdentifier: "com.balance.vi", // Explicitly set this too
      },
      extra: {
        ...config.expo?.extra, // Preserve existing properties
        apiUrl: isPhysicalDevice ? env.API_URL_PHYSICAL : env.API_URL,
        eas: {
          ...(config.expo?.eas || {}), // Preserve existing EAS config
          projectId: "a29584cc-200b-449e-b916-401ca4aad869",
        },
      },
    },
  };
};
