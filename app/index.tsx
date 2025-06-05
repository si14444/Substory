import { StyleSheet, View } from "react-native";
import Header from "../components/index/Header";
import TotalPriceComponent from "../components/index/TotalPriceComponent";
import SubscriptionComponent from "../components/index/subscription/SubscriptionComponent";
import { Subscription } from "../types/subscription";

const subscriptionList: Subscription[] = [
  {
    name: "유튜브 프리미엄",
    price: 10000,
    date: 2,
  },
  {
    name: "넷플릭스",
    price: 10000,
    date: 14,
  },
  {
    name: "쿠팡 플레이스",
    price: 10000,
    date: 31,
  },
];

const Home = () => {
  return (
    <View style={styles.container}>
      <Header />
      <TotalPriceComponent subscriptionList={subscriptionList} />
      <SubscriptionComponent subscriptionList={subscriptionList} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
