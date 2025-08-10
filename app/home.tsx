import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import AdBanner from "../components/AdBanner";
import CustomInterstitialModal from "../components/CustomInterstitialModal";
import Header from "../components/index/Header";
import TotalPriceComponent from "../components/index/TotalPriceComponent";
import SubscriptionComponent from "../components/index/subscription/SubscriptionComponent";
import { useSubscriptions } from "../hooks/useSubscriptions";
import AdFrequencyManager from "../utils/adManager";
import {
  requestNotificationPermission,
  schedulePaymentNotifications,
} from "../utils/notification";

export default function Home() {
  const {
    data: subscriptionList = [],
    isLoading,
    refetch,
  } = useSubscriptions();

  const [sortedSubscriptions, setSortedSubscriptions] =
    useState(subscriptionList);
  const [showInterstitialModal, setShowInterstitialModal] = useState(false);

  // 앱 실행 시 하루에 한 번 전면 광고 표시
  useEffect(() => {
    AdFrequencyManager.handleAppLaunch((onClose) => {
      setShowInterstitialModal(true);
    });
  }, []);

  const handleCloseInterstitialModal = async () => {
    setShowInterstitialModal(false);
    // 광고 표시 기록
    await AdFrequencyManager.recordAdShown("launch");
  };

  // 테스트용 광고 표시 함수
  const handleTestAd = () => {
    setShowInterstitialModal(true);
  };

  // subscriptionList가 변경될 때마다 sortedSubscriptions 업데이트
  useEffect(() => {
    setSortedSubscriptions(subscriptionList);
  }, [subscriptionList]);

  // 구독 리스트가 변경될 때마다 결제 하루 전 알림 예약
  useEffect(() => {
    if (subscriptionList.length > 0) {
      requestNotificationPermission().then((granted) => {
        if (granted) {
          schedulePaymentNotifications(subscriptionList);
        }
      });
    }
  }, [subscriptionList]);

  // 정렬
  const handleSort = (
    type:
      | "dateAsc"
      | "dateDesc"
      | "priceAsc"
      | "priceDesc"
      | "paymentMethod"
      | "default"
  ) => {
    const sorted = [...subscriptionList].sort((a, b) => {
      if (type === "default") return a.name.localeCompare(b.name);
      if (type === "dateAsc") return a.date - b.date;
      if (type === "dateDesc") return b.date - a.date;
      if (type === "priceAsc") return a.price - b.price;
      if (type === "priceDesc") return b.price - a.price;
      if (type === "paymentMethod")
        return a.paymentMethod.localeCompare(b.paymentMethod);
      return 0;
    });
    setSortedSubscriptions(sorted);
  };

  return (
    <View style={styles.container}>
      <Header onTestAd={handleTestAd} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <TotalPriceComponent subscriptionList={subscriptionList} />
        <SubscriptionComponent
          subscriptionList={sortedSubscriptions}
          handleSort={handleSort}
          refetchSubscriptions={refetch}
        />
      </ScrollView>
      <AdBanner style={styles.adBanner} />

      {/* 배너 광고 모달 */}
      <CustomInterstitialModal
        visible={showInterstitialModal}
        onClose={handleCloseInterstitialModal}
        adUnitId={__DEV__ ? "ca-app-pub-3940256099942544/6300978111" : process.env.EXPO_PUBLIC_ADMOB_BANNER_ID || ""}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  adBanner: {
    width: "100%",
    marginBottom: 0,
  },
});
