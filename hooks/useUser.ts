import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./apiClient";

interface UserExistsType {
  exists: boolean;
}
export const useGetUserExists = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  const api = useApiClient();
  return useQuery<UserExistsType>({
    queryKey: ["get-user-exists"], //! UNIQUE !
    queryFn: async () => {
      const result = await api<{
        data: UserExistsType;
      }>(`/users/exists`);
      return result.data;
    },
    staleTime: 0,
    enabled: enabled,
  });
};
