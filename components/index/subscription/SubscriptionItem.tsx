import { MaterialIcons } from "@expo/vector-icons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../styles/theme";
import { Subscription } from "../../../types/subscription";

const SubscriptionItem = ({
  subscription,
  onDelete,
}: {
  subscription: Subscription;
  onDelete?: () => void;
}) => {
  const today = new Date();

  // 월 날짜 조정
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  // 월 날짜 조정
  const adjustDateForMonth = (date: number, month: number) => {
    const daysInMonth = getDaysInMonth(today.getFullYear(), month);
    return date > daysInMonth ? daysInMonth : date;
  };

  // 다음 결제일
  const nextPaymentDate = (() => {
    let nextMonth =
      today.getDate() > subscription.date
        ? today.getMonth() + 2
        : today.getMonth() + 1;

    // 12월인 경우 1월로 변경
    if (nextMonth > 12) {
      nextMonth = 1;
    }

    const adjustedDate = adjustDateForMonth(subscription.date, nextMonth);
    return `${nextMonth}월 ${adjustedDate}일`;
  })();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{subscription.name}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "addSubscriptionModal",
                params: {
                  name: subscription.name,
                  price: subscription.price,
                  date: subscription.date,
                  paymentMethod: subscription.paymentMethod,
                },
              })
            }
          >
            <EvilIcons name="pencil" size={24} color="black" />
          </Pressable>
          {/* 삭제 버튼 */}
          {onDelete && (
            <Pressable onPress={onDelete} style={{ marginLeft: 4 }}>
              <MaterialIcons name="delete" size={24} color="#E74C3C" />
            </Pressable>
          )}
        </View>
      </View>
      <View style={styles.subscriptionInfoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>결제 금액</Text>
          <Text style={styles.value}>
            {subscription.price.toLocaleString()}원
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoItem}>
          <Text style={styles.label}>결제 수단</Text>
          <Text style={styles.value}>{subscription.paymentMethod}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoItem}>
          <Text style={styles.label}>다음 결제일</Text>
          <Text style={styles.value}>{nextPaymentDate}</Text>
        </View>
      </View>
    </View>
  );
};

export default SubscriptionItem;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: Colors.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
  subscriptionInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoItem: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: Colors.secondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.secondary,
    opacity: 0.3,
    marginHorizontal: 8,
  },
});
