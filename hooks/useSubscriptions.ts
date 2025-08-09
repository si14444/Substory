import { useQuery } from "@tanstack/react-query";
import { fetchSubscriptions } from "../utils/subscription";

export function useSubscriptions() {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
  });
}
