import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../../styles/theme";
import { Subscription } from "../../../types/subscription";
import SubscriptionItem from "./SubscriptionItem";
const SubscriptionComponent = ({
  subscriptionList,
}: {
  subscriptionList: Subscription[];
}) => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("addSubscriptionModal")}
      >
        <Text style={styles.addButtonText}>구독 서비스 추가하기</Text>
      </TouchableOpacity>
      {subscriptionList.map((subscription, index) => (
        <SubscriptionItem key={index} subscription={subscription} />
      ))}
    </View>
  );
};

export default SubscriptionComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    width: "100%",
  },
  addButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
