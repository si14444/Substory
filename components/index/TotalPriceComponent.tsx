import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../styles/theme";

const TotalPriceComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>구독 현황</Text>
      <View style={styles.totalPriceContainer}>
        <Text style={styles.label}>총 월 구독 금액</Text>
        <Text style={styles.value}>10,000원</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.totalPriceContainer}>
        <Text style={styles.label}>이번 달 남은 금액</Text>
        <Text style={styles.value}>5,000원</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.totalPriceContainer}>
        <Text style={styles.label}>구독중인 서비스 수</Text>
        <Text style={styles.value}>10개</Text>
      </View>
    </View>
  );
};

export default TotalPriceComponent;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    marginTop: 20,
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: Colors.primary,
    shadowColor: Colors.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
    color: Colors.primary,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#e6eeff",
  },
});
