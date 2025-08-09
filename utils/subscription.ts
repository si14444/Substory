import * as FileSystem from 'expo-file-system';
import { Subscription } from "../types/subscription";

const SUBSCRIPTIONS_FILE = FileSystem.documentDirectory + 'subscriptions.json';

// 구독 목록 조회
export async function fetchSubscriptions(): Promise<Subscription[]> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(SUBSCRIPTIONS_FILE);
    if (!fileInfo.exists) {
      return [];
    }
    
    const content = await FileSystem.readAsStringAsync(SUBSCRIPTIONS_FILE);
    const data = JSON.parse(content);
    return data.subscriptions || [];
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return [];
  }
}

// 구독 추가
export async function addSubscription(subscription: Subscription) {
  try {
    const subscriptions = await fetchSubscriptions();
    const newSubscription = {
      ...subscription,
      id: Date.now().toString(), // 간단한 ID 생성
      createdAt: new Date().toISOString(),
    };
    
    subscriptions.push(newSubscription);
    
    await FileSystem.writeAsStringAsync(
      SUBSCRIPTIONS_FILE,
      JSON.stringify({ subscriptions }, null, 2)
    );
  } catch (error) {
    console.error('Error adding subscription:', error);
    throw error;
  }
}

// 구독 삭제
export async function deleteSubscription(targetSubscription: Subscription) {
  try {
    const subscriptions = await fetchSubscriptions();
    const filteredSubscriptions = subscriptions.filter(
      (sub) =>
        !(sub.name === targetSubscription.name &&
          sub.price === targetSubscription.price &&
          sub.date === targetSubscription.date &&
          sub.paymentMethod === targetSubscription.paymentMethod)
    );
    
    await FileSystem.writeAsStringAsync(
      SUBSCRIPTIONS_FILE,
      JSON.stringify({ subscriptions: filteredSubscriptions }, null, 2)
    );
  } catch (error) {
    console.error('Error deleting subscription:', error);
    throw error;
  }
}
