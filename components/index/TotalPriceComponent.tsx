import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../styles/theme";
import { Subscription } from "../../types/subscription";

const TotalPriceComponent = ({
  subscriptionList,
}: {
  subscriptionList: Subscription[];
}) => {
  const today = new Date();

  //총 월 구독 금액
  const totalPrice = subscriptionList.reduce(
    (acc, subscription) => acc + subscription.price,
    0
  );

  //이번 달 남은 금액
  const remainingPrice =
    totalPrice -
    subscriptionList.reduce((acc, subscription) => {
      if (subscription.date < today.getDate()) {
        return acc + subscription.price;
      }
      return acc;
    }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>구독 현황</Text>
      <View style={styles.totalPriceContainer}>
        <Text style={styles.label}>총 월 구독 금액</Text>
        <Text style={styles.value}>{totalPrice.toLocaleString()}원</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.totalPriceContainer}>
        <Text style={styles.label}>이번 달 남은 금액</Text>
        <Text style={styles.value}>{remainingPrice.toLocaleString()}원</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.totalPriceContainer}>
        <Text style={styles.label}>구독중인 서비스 수</Text>
        <Text style={styles.value}>{subscriptionList.length}개</Text>
      </View>
    </View>
  );
};

export default TotalPriceComponent;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#E6F2FF",
  },
  totalPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: Colors.secondary,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.value,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.secondary,
    opacity: 0.3,
  },
});
