import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Header from "../components/index/Header";
import TotalPriceComponent from "../components/index/TotalPriceComponent";
import SubscriptionComponent from "../components/index/subscription/SubscriptionComponent";
import { useSubscriptions } from "../hooks/useSubscriptions";
import {
  requestNotificationPermission,
  schedulePaymentNotifications,
} from "../utils/notification";

const queryClient = new QueryClient();

function HomeContent() {
  const {
    data: subscriptionList = [],
    isLoading,
    refetch,
  } = useSubscriptions();

  // 구독 리스트가 변경될 때마다 결제 하루 전 알림 예약
  useEffect(() => {
    if (subscriptionList.length > 0) {
      requestNotificationPermission().then((granted) => {
        if (granted) {
          schedulePaymentNotifications(subscriptionList);
        }
      });
    }
  }, [subscriptionList]);

  // 정렬
  const handleSort = (
    type:
      | "dateAsc"
      | "dateDesc"
      | "priceAsc"
      | "priceDesc"
      | "paymentMethod"
      | "default"
  ) => {
    // 클라이언트 정렬만 적용 (refetch는 그대로)
    return [...subscriptionList].sort((a, b) => {
      if (type === "default") return a.name.localeCompare(b.name);
      if (type === "dateAsc") return a.date - b.date;
      if (type === "dateDesc") return b.date - a.date;
      if (type === "priceAsc") return a.price - b.price;
      if (type === "priceDesc") return b.price - a.price;
      if (type === "paymentMethod")
        return a.paymentMethod.localeCompare(b.paymentMethod);
      return 0;
    });
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <TotalPriceComponent subscriptionList={subscriptionList} />
        <SubscriptionComponent
          subscriptionList={subscriptionList}
          handleSort={handleSort}
          refetchSubscriptions={refetch}
        />
      </ScrollView>
    </View>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomeContent />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});
