import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Subscription } from "../types/subscription";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// 구독 목록 조회 (로그인된 유저)
export async function fetchSubscriptions(
  userId: string
): Promise<Subscription[]> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("name, price, date, payment_method")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  // 컬럼명 매핑
  return (
    data?.map((item) => ({
      name: item.name,
      price: item.price,
      date: item.date,
      paymentMethod: item.payment_method,
    })) ?? []
  );
}

// 구독 추가
export async function addSubscription(
  userId: string,
  subscription: Subscription
) {
  const { error } = await supabase.from("subscriptions").insert({
    user_id: userId,
    name: subscription.name,
    price: subscription.price,
    date: subscription.date,
    payment_method: subscription.paymentMethod,
  });
  if (error) throw error;
}
