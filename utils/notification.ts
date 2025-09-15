import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications/build/Notifications.types";
import { Subscription } from "../types/subscription";

// 알림 권한 요청
export async function requestNotificationPermission() {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.warn("알림 권한이 거부되었습니다.");
      return false;
    }
    return true;
  } catch (error) {
    console.error("알림 권한 요청 실패:", error);
    return false;
  }
}

// 기존 예약된 알림 모두 취소
export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("기존 알림이 모두 취소되었습니다.");
  } catch (error) {
    console.error("알림 취소 실패:", error);
  }
}

// 결제 하루 전 알림 예약 (매월 반복)
export async function schedulePaymentNotifications(
  subscriptions: Subscription[]
) {
  try {
    // 기존 알림 모두 취소
    await cancelAllNotifications();

    for (const sub of subscriptions) {
      // 매월 반복되는 알림 예약
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${sub.name} 결제일 알림`,
          body: `${sub.name} 결제가 내일(${sub.date}일) 예정입니다. 금액: ${sub.price.toLocaleString()}원`,
          sound: true,
          data: {
            subscriptionId: sub.id,
            subscriptionName: sub.name,
            paymentDate: sub.date,
            price: sub.price,
          },
        },
        trigger: {
          type: SchedulableTriggerInputTypes.CALENDAR,
          repeats: true, // 매월 반복
          day: sub.date - 1, // 결제일 하루 전
          hour: 9, // 오전 9시
          minute: 0,
          second: 0,
        },
      });

      console.log(`${sub.name} 알림 예약 완료 (ID: ${notificationId})`);
    }

    console.log(`총 ${subscriptions.length}개의 알림이 예약되었습니다.`);
  } catch (error) {
    console.error("알림 예약 실패:", error);
    throw error;
  }
}

// 예약된 알림 목록 확인 (디버깅용)
export async function getScheduledNotifications() {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log("예약된 알림 목록:", notifications);
    return notifications;
  } catch (error) {
    console.error("예약된 알림 조회 실패:", error);
    return [];
  }
}
