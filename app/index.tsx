import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Header from "../components/index/Header";
import TotalPriceComponent from "../components/index/TotalPriceComponent";
import SubscriptionComponent from "../components/index/subscription/SubscriptionComponent";
import { Subscription } from "../types/subscription";

const subscriptionListData: Subscription[] = [
  {
    name: "유튜브 프리미엄",
    price: 10000,
    date: 2,
    paymentMethod: "토스",
  },
  {
    name: "넷플릭스",
    price: 10000,
    date: 14,
    paymentMethod: "농협카드",
  },
  {
    name: "쿠팡 플레이스",
    price: 10000,
    date: 31,
    paymentMethod: "토스",
  },
  {
    name: "카카오톡",
    price: 10000,
    date: 1,
    paymentMethod: "농협카드",
  },
];

const Home = () => {
  const [subscriptionList, setSubscriptionList] =
    useState<Subscription[]>(subscriptionListData);

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
    if (type === "default") {
      setSubscriptionList(
        subscriptionList.sort((a, b) => a.name.localeCompare(b.name))
      );
    } else if (type === "dateAsc") {
      setSubscriptionList(subscriptionList.sort((a, b) => a.date - b.date));
    } else if (type === "dateDesc") {
      setSubscriptionList(subscriptionList.sort((a, b) => b.date - a.date));
    } else if (type === "priceAsc") {
      setSubscriptionList(subscriptionList.sort((a, b) => a.price - b.price));
    } else if (type === "priceDesc") {
      setSubscriptionList(subscriptionList.sort((a, b) => b.price - a.price));
    } else if (type === "paymentMethod") {
      setSubscriptionList(
        subscriptionList.sort((a, b) =>
          a.paymentMethod.localeCompare(b.paymentMethod)
        )
      );
    }
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
