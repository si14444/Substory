import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
const Header = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <FontAwesome
        name="gear"
        size={24}
        color="#B0B0B0"
        onPress={() => router.push("/settings")}
      />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
});
