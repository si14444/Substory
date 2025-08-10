import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

interface HeaderProps {
  onTestAd?: () => void;
}

const Header = ({ onTestAd }: HeaderProps) => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {__DEV__ && onTestAd && (
        <TouchableOpacity style={styles.testButton} onPress={onTestAd}>
          <Text style={styles.testButtonText}>광고 테스트</Text>
        </TouchableOpacity>
      )}
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  testButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  testButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});
