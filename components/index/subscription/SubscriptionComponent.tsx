import { StyleSheet, View } from "react-native";
import { Subscription } from "../../../types/subscription";
import SubscriptionItem from "./SubscriptionItem";
const SubscriptionComponent = ({
  subscriptionList,
}: {
  subscriptionList: Subscription[];
}) => {
  return (
    <View style={styles.container}>
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
});
