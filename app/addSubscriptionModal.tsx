import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../styles/theme";
import { addSubscription, supabase } from "../utils/subscription";
const AddSubscriptionModal = () => {
  const params = useLocalSearchParams<{
    name?: string;
    price?: string;
    date?: string;
    paymentMethod?: string;
  }>();

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [name, setName] = useState(params?.name || "");
  const [price, setPrice] = useState(params?.price || "");
  const [date, setDate] = useState(params?.date || "");
  const [paymentMethod, setPaymentMethod] = useState(
    params?.paymentMethod || ""
  );

  const handleSubmit = async () => {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) {
        Alert.alert("오류", "로그인 정보를 불러올 수 없습니다.");
        return;
      }
      console.log("user_id:", userData.user.id);
      console.log("입력값:", { name, price, date, paymentMethod });
      await addSubscription(userData.user.id, {
        name,
        price: Number(price),
        date: Number(date),
        paymentMethod,
      });
      router.back();
    } catch (e: any) {
      console.log("구독 추가 에러:", e);
      Alert.alert("오류", e.message || JSON.stringify(e));
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>구독 서비스 추가</Text>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>서비스 이름</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="예) 넷플릭스"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>결제 금액</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="예) 10000"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>결제일</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="예) 15"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>결제 수단</Text>
          <TextInput
            style={styles.input}
            value={paymentMethod}
            onChangeText={setPaymentMethod}
            placeholder="예) 토스"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>저장하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.closeButtonText}>취소</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddSubscriptionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 32,
    textAlign: "center",
  },
  form: {
    width: "100%",
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: Colors.secondary,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E9ECEF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#F8F9FA",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  closeButton: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  closeButtonText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: "600",
  },
});
