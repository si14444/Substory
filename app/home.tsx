import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import Header from "../components/index/Header";
import TotalPriceComponent from "../components/index/TotalPriceComponent";
import SubscriptionComponent from "../components/index/subscription/SubscriptionComponent";
import { Subscription } from "../types/subscription";
import {
  requestNotificationPermission,
  schedulePaymentNotifications,
} from "../utils/notification";
import { fetchSubscriptions, supabase } from "../utils/subscription";

const Home = () => {
  const [subscriptionList, setSubscriptionList] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) {
        Alert.alert("오류", "로그인 정보를 불러올 수 없습니다.");
        setLoading(false);
        return;
      }
      try {
        const subs = await fetchSubscriptions(userData.user.id);
        setSubscriptionList(subs);
      } catch (e) {
        Alert.alert("오류", "구독 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
    setSubscriptionList((prev) => {
      const list = [...prev];
      if (type === "default") {
        return list.sort((a, b) => a.name.localeCompare(b.name));
      } else if (type === "dateAsc") {
        return list.sort((a, b) => a.date - b.date);
      } else if (type === "dateDesc") {
        return list.sort((a, b) => b.date - a.date);
      } else if (type === "priceAsc") {
        return list.sort((a, b) => a.price - b.price);
      } else if (type === "priceDesc") {
        return list.sort((a, b) => b.price - a.price);
      } else if (type === "paymentMethod") {
        return list.sort((a, b) =>
          a.paymentMethod.localeCompare(b.paymentMethod)
        );
      }
      return list;
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
        />
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});
