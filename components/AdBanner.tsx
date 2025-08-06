import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

interface AdBannerProps {
  style?: any;
}

const AdBanner: React.FC<AdBannerProps> = ({ style }) => {
  const [loaded, setLoaded] = useState(false);

  // Test Ad Unit IDs for development
  const adUnitId = __DEV__
    ? TestIds.BANNER
    : Platform.select({
        ios: process.env.EXPO_PUBLIC_ADMOB_IOS_BANNER_ID,
        android: process.env.EXPO_PUBLIC_ADMOB_ANDROID_BANNER_ID,
      });

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={adUnitId!}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          setLoaded(true);
        }}
        onAdFailedToLoad={(error) => {
          console.log("Ad failed to load:", error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
});

export default AdBanner;
