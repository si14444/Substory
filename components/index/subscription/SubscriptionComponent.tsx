import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../../styles/theme";
import { Subscription } from "../../../types/subscription";
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

      {/* 구독 서비스 목록 */}
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
});
