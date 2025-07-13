import { useQuery } from "@tanstack/react-query";
import { fetchSubscriptions, supabase } from "../utils/subscription";

export function useSubscriptions() {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user)
        throw new Error("로그인 정보를 불러올 수 없습니다.");
      return await fetchSubscriptions(userData.user.id);
    },
  });
}
