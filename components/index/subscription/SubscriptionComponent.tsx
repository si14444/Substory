import { StyleSheet, Text, View } from "react-native";
import { Subscription } from "../../../types/subscription";

const SubscriptionComponent = ({
  subscriptionList,
}: {
  subscriptionList: Subscription[];
}) => {
  return (
    <View style={styles.container}>
      {subscriptionList.map((subscription) => (
        <View key={subscription.name}>
          <Text>{subscription.name}</Text>
        </View>
      ))}
    </View>
  );
};

export default SubscriptionComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
});
