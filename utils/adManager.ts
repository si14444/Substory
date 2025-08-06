import AsyncStorage from '@react-native-async-storage/async-storage';
import { InterstitialAdManager } from '../components/InterstitialAd';

interface AdFrequencyData {
  lastAdTime: number;
  dailyCount: number;
  sessionCount: number;
  lastLaunchDate: string;
  totalAdsShown: number;
}

export class AdFrequencyManager {
  private static readonly STORAGE_KEY = 'ad_frequency_data';
  
  // 광고 빈도 제한 설정
  private static readonly AD_FREQUENCY = {
    MAX_PER_SESSION: 2,      // 세션당 최대 2회
    MIN_INTERVAL: 300000,    // 최소 5분 간격 (5 * 60 * 1000ms)
    DAILY_LIMIT: 5,          // 일일 최대 5회
    LAUNCH_DELAY: 3000,      // 앱 실행 후 3초 지연
  };

  private static sessionStartTime = Date.now();

  /**
   * 광고 빈도 데이터를 가져옴
   */
  private static async getAdFrequencyData(): Promise<AdFrequencyData> {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data) as AdFrequencyData;
        
        // 날짜가 바뀌었으면 일일 카운트 초기화
        const today = new Date().toDateString();
        if (parsed.lastLaunchDate !== today) {
          parsed.dailyCount = 0;
          parsed.sessionCount = 0;
          parsed.lastLaunchDate = today;
        }
        
        return parsed;
      }
    } catch (error) {
      console.log('Failed to get ad frequency data:', error);
    }

    // 기본값
    return {
      lastAdTime: 0,
      dailyCount: 0,
      sessionCount: 0,
      lastLaunchDate: new Date().toDateString(),
      totalAdsShown: 0,
    };
  }

  /**
   * 광고 빈도 데이터를 저장
   */
  private static async saveAdFrequencyData(data: AdFrequencyData): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.log('Failed to save ad frequency data:', error);
    }
  }

  /**
   * 광고를 표시해도 되는지 확인
   */
  static async shouldShowAd(adType: 'launch' | 'action' = 'action'): Promise<boolean> {
    const data = await this.getAdFrequencyData();
    const now = Date.now();
    
    // 시간 간격 체크
    if (now - data.lastAdTime < this.AD_FREQUENCY.MIN_INTERVAL) {
      console.log('Ad blocked: Too soon since last ad');
      return false;
    }

    // 일일 한도 체크
    if (data.dailyCount >= this.AD_FREQUENCY.DAILY_LIMIT) {
      console.log('Ad blocked: Daily limit reached');
      return false;
    }

    // 세션 한도 체크
    if (data.sessionCount >= this.AD_FREQUENCY.MAX_PER_SESSION) {
      console.log('Ad blocked: Session limit reached');
      return false;
    }

    // 앱 실행 직후라면 일일 1회만 허용
    if (adType === 'launch') {
      const today = new Date().toDateString();
      const hasShownLaunchAdToday = data.lastLaunchDate === today && data.dailyCount > 0;
      
      if (hasShownLaunchAdToday) {
        console.log('Ad blocked: Launch ad already shown today');
        return false;
      }

      // 앱 실행 후 충분한 시간이 지났는지 확인
      if (now - this.sessionStartTime < this.AD_FREQUENCY.LAUNCH_DELAY) {
        console.log('Ad blocked: Too soon after app launch');
        return false;
      }
    }

    return true;
  }

  /**
   * 광고 표시 후 호출하여 카운트 업데이트
   */
  static async recordAdShown(adType: 'launch' | 'action' = 'action'): Promise<void> {
    const data = await this.getAdFrequencyData();
    const now = Date.now();

    data.lastAdTime = now;
    data.dailyCount += 1;
    data.sessionCount += 1;
    data.totalAdsShown += 1;

    await this.saveAdFrequencyData(data);
    
    console.log(`Ad shown - Daily: ${data.dailyCount}/${this.AD_FREQUENCY.DAILY_LIMIT}, Session: ${data.sessionCount}/${this.AD_FREQUENCY.MAX_PER_SESSION}`);
  }

  /**
   * 앱 실행 시 호출 - 일일 1회 광고 표시
   */
  static async handleAppLaunch(): Promise<void> {
    const canShow = await this.shouldShowAd('launch');
    
    if (!canShow) {
      console.log('Launch ad skipped due to frequency limits');
      return;
    }

    const adManager = InterstitialAdManager.getInstance();
    
    // 광고가 로드되지 않았다면 로드 시도
    if (!adManager.isAdReady()) {
      adManager.loadAd();
      
      // 최대 5초 대기
      let attempts = 0;
      const maxAttempts = 10; // 0.5초 * 10 = 5초
      
      const waitForAd = () => {
        setTimeout(() => {
          if (adManager.isAdReady()) {
            this.showLaunchAd();
          } else if (attempts < maxAttempts) {
            attempts++;
            waitForAd();
          } else {
            console.log('Launch ad timeout - failed to load');
          }
        }, 500);
      };
      
      waitForAd();
    } else {
      // 지연 후 광고 표시
      setTimeout(() => {
        this.showLaunchAd();
      }, this.AD_FREQUENCY.LAUNCH_DELAY);
    }
  }

  /**
   * 실제로 런치 광고를 표시
   */
  private static showLaunchAd(): void {
    const adManager = InterstitialAdManager.getInstance();
    
    const success = adManager.showAd({
      onAdShown: () => {
        console.log('Launch interstitial ad shown');
      },
      onAdClosed: () => {
        console.log('Launch interstitial ad closed');
        this.recordAdShown('launch');
      },
      onError: (error) => {
        console.log('Launch interstitial ad error:', error);
      },
    });

    if (!success) {
      console.log('Failed to show launch ad');
    }
  }

  /**
   * 액션 기반 광고 표시 (구독 추가 완료 등)
   */
  static async showActionAd(actionType: string): Promise<boolean> {
    const canShow = await this.shouldShowAd('action');
    
    if (!canShow) {
      console.log(`Action ad (${actionType}) skipped due to frequency limits`);
      return false;
    }

    const adManager = InterstitialAdManager.getInstance();
    
    const success = adManager.showAd({
      onAdShown: () => {
        console.log(`Action interstitial ad shown: ${actionType}`);
      },
      onAdClosed: () => {
        console.log(`Action interstitial ad closed: ${actionType}`);
        this.recordAdShown('action');
      },
      onError: (error) => {
        console.log(`Action interstitial ad error (${actionType}):`, error);
      },
    });

    return success;
  }

  /**
   * 광고 통계 조회
   */
  static async getAdStats(): Promise<AdFrequencyData> {
    return await this.getAdFrequencyData();
  }

  /**
   * 광고 데이터 초기화 (개발/테스트용)
   */
  static async resetAdData(): Promise<void> {
    await AsyncStorage.removeItem(this.STORAGE_KEY);
    console.log('Ad frequency data reset');
  }
}

export default AdFrequencyManager;