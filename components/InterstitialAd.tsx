import { useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

interface InterstitialAdManagerProps {
  onAdClosed?: () => void;
  onAdShown?: () => void;
  onError?: (error: any) => void;
}

export class InterstitialAdManager {
  private static instance: InterstitialAdManager;
  private interstitialAd: InterstitialAd | null = null;
  private isLoaded = false;
  private isLoading = false;

  private constructor() {
    this.initializeAd();
  }

  public static getInstance(): InterstitialAdManager {
    if (!InterstitialAdManager.instance) {
      InterstitialAdManager.instance = new InterstitialAdManager();
    }
    return InterstitialAdManager.instance;
  }

  private initializeAd() {
    // Test Ad Unit IDs for development
    const adUnitId = __DEV__
      ? TestIds.INTERSTITIAL
      : Platform.select({
          ios: "ca-app-pub-4535163023491412/6721869094",
          android: "ca-app-pub-4535163023491412/7707647709",
        });

    if (!adUnitId) return;

    this.interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    // 광고 로드 완료 이벤트
    this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      this.isLoaded = true;
      this.isLoading = false;
      console.log("Interstitial ad loaded");
    });

    // 광고 실패 이벤트
    this.interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
      this.isLoaded = false;
      this.isLoading = false;
      console.log("Interstitial ad failed to load:", error);
    });

    // 광고 닫힘 이벤트
    this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      this.isLoaded = false;
      console.log("Interstitial ad closed");
      // 다음 광고를 미리 로드
      this.loadAd();
    });
  }

  public loadAd(): void {
    if (!this.interstitialAd || this.isLoaded || this.isLoading) return;

    this.isLoading = true;
    this.interstitialAd.load();
  }

  public showAd(callbacks?: InterstitialAdManagerProps): boolean {
    if (!this.interstitialAd || !this.isLoaded) {
      console.log("Interstitial ad not ready");
      callbacks?.onError?.(new Error("Ad not loaded"));
      return false;
    }

    // 광고 표시 이벤트 리스너 추가
    const showListener = this.interstitialAd.addAdEventListener(
      AdEventType.OPENED,
      () => {
        callbacks?.onAdShown?.();
        showListener(); // 리스너 제거
      }
    );

    const closedListener = this.interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        callbacks?.onAdClosed?.();
        closedListener(); // 리스너 제거
      }
    );

    try {
      this.interstitialAd.show();
      return true;
    } catch (error) {
      console.log("Failed to show interstitial ad:", error);
      callbacks?.onError?.(error);
      return false;
    }
  }

  public isAdReady(): boolean {
    return this.isLoaded;
  }
}

// React Hook for easier usage
export const useInterstitialAd = () => {
  const [isReady, setIsReady] = useState(false);
  const adManager = InterstitialAdManager.getInstance();

  useEffect(() => {
    // 초기 로드
    adManager.loadAd();

    // 주기적으로 상태 체크 (실제로는 이벤트 기반으로 개선 가능)
    const checkInterval = setInterval(() => {
      setIsReady(adManager.isAdReady());
    }, 1000);

    return () => clearInterval(checkInterval);
  }, []);

  const showAd = (callbacks?: InterstitialAdManagerProps) => {
    return adManager.showAd(callbacks);
  };

  return {
    isReady,
    showAd,
    loadAd: () => adManager.loadAd(),
  };
};

export default InterstitialAdManager;
