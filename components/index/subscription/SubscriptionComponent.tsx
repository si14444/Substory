import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../../styles/theme";
import { Subscription } from "../../../types/subscription";
import { deleteSubscription, supabase } from "../../../utils/subscription";
import SubscriptionItem from "./SubscriptionItem";

const sortOptions = [
  { type: "priceDesc", text: "가격 높은순" },
  { type: "priceAsc", text: "가격 낮은순" },
  { type: "dateAsc", text: "날짜 빠른순" },
  { type: "dateDesc", text: "날짜 늦은순" },
  { type: "paymentMethod", text: "결제 수단" },
  { type: "default", text: "기본" },
];

const SubscriptionComponent = ({
  subscriptionList,
  handleSort,
  refetchSubscriptions,
}: {
  subscriptionList: Subscription[];
  handleSort: (
    type:
      | "dateAsc"
      | "dateDesc"
      | "priceAsc"
      | "priceDesc"
      | "paymentMethod"
      | "default"
  ) => void;
  refetchSubscriptions?: () => void | Promise<any>;
}) => {
  const router = useRouter();
  const [isShowSortModal, setIsShowSortModal] = useState(false);
  const [sort, setSort] = useState<
    | "dateAsc"
    | "dateDesc"
    | "priceAsc"
    | "priceDesc"
    | "paymentMethod"
    | "default"
  >("default");

  // 삭제 핸들러
  const handleDelete = async (subscription: Subscription) => {
    Alert.alert("구독 삭제", `${subscription.name} 구독을 삭제하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            const { data: userData, error: userError } =
              await supabase.auth.getUser();
            if (userError || !userData?.user) {
              Alert.alert("오류", "로그인 정보를 불러올 수 없습니다.");
              return;
            }
            await deleteSubscription(userData.user.id, subscription);
            if (refetchSubscriptions) {
              await refetchSubscriptions();
            }
            Alert.alert("삭제 완료", "구독이 삭제되었습니다.");
          } catch (e: any) {
            Alert.alert("오류", e.message || JSON.stringify(e));
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("addSubscriptionModal")}
      >
        <Text style={styles.addButtonText}>구독 서비스 추가하기</Text>
      </TouchableOpacity>

      {/* 정렬 */}
      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setIsShowSortModal(!isShowSortModal)}
        >
          <Text style={styles.sortButtonText}>
            {sort === "default"
              ? "정렬"
              : sortOptions.find((item) => item.type === sort)?.text}
          </Text>
          {isShowSortModal ? (
            <AntDesign name="up" size={16} color={Colors.primary} />
          ) : (
            <AntDesign name="down" size={16} color={Colors.primary} />
          )}
        </TouchableOpacity>
        {isShowSortModal && (
          <View style={styles.sortModal}>
            {sortOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.sortOption,
                  index === sortOptions.length - 1 && styles.lastSortOption,
                ]}
                onPress={() => {
                  handleSort(
                    item.type as
                      | "dateAsc"
                      | "dateDesc"
                      | "priceAsc"
                      | "priceDesc"
                      | "paymentMethod"
                      | "default"
                  );
                  setSort(
                    item.type as
                      | "dateAsc"
                      | "dateDesc"
                      | "priceAsc"
                      | "priceDesc"
                      | "paymentMethod"
                      | "default"
                  );
                  setIsShowSortModal(false);
                }}
              >
                <Text style={styles.sortOptionText}>{item.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* 구독 서비스가 없을 때 안내 문구 (정렬 아래) */}
      {subscriptionList.length === 0 && (
        <View style={styles.guideBox}>
          <Text style={styles.guideText}>구독 서비스를 추가해보세요!</Text>
        </View>
      )}

      {/* 구독 서비스 목록 */}
      {subscriptionList.map((subscription, index) => (
        <SubscriptionItem
          key={index}
          subscription={subscription}
          onDelete={() => handleDelete(subscription)}
        />
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
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  sortButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  sortModal: {
    position: "absolute",
    top: 45,
    left: 0,
    backgroundColor: "white",
    borderRadius: 12,
    width: 140,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    zIndex: 1000,
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sortOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  lastSortOption: {
    borderBottomWidth: 0,
  },
  sortOptionText: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
  },
  guideBox: {
    backgroundColor: "#fffbe6",
    borderRadius: 10,
    padding: 18,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffe58f",
  },
  guideText: {
    color: "#ad8b00",
    fontSize: 15,
    fontWeight: "500",
  },
});
