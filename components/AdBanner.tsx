import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

interface AdBannerProps {
  style?: any;
}

const AdBanner: React.FC<AdBannerProps> = ({ style }) => {
  const [loaded, setLoaded] = useState(false);

  // Test Ad Unit IDs for development
  const adUnitId = __DEV__ 
    ? TestIds.BANNER
    : Platform.select({
        ios: 'ca-app-pub-3940256099942544/2934735716',
        android: 'ca-app-pub-3940256099942544/6300978111',
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
          console.log('Ad failed to load:', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
});

export default AdBanner;