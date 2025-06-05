import { StyleSheet, View } from "react-native";
import Header from "../components/index/Header";
import TotalPriceComponent from "../components/index/TotalPriceComponent";
const Home = () => {
  return (
    <View style={styles.container}>
      <Header />
      <TotalPriceComponent />
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
