import { useAuth0 } from "react-native-auth0";
import Constants from "expo-constants";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ViCustomError;
  }
}

export const useApiClient = () => {
  const { getCredentials } = useAuth0();

  return async function authedApi<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const token = await getCredentials();
    return apiClient(endpoint, options, token?.accessToken);
  };
};

export class ViCustomError extends Error {
  status: number;
  data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = "ViCustomError";
    this.status = status;
    this.data = data;
  }
}

const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {},
  accessToken?: string
): Promise<T> => {
  console.info(`ℹ️  Fetching ${endpoint}`);

  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  const headers: Record<string, any> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  console.log(response);
  //   if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
  if (!response.ok) {
    const data = await response.json();
    throw new ViCustomError(
      response.status,
      data?.message || "Unknown error",
      data
    );
  }
  return response.json();
};
