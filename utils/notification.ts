import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications/build/Notifications.types";
import { Subscription } from "../types/subscription";

// 알림 권한 요청
export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

// 결제 하루 전 알림 예약
export async function schedulePaymentNotifications(
  subscriptions: Subscription[]
) {
  for (const sub of subscriptions) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    let notifyDate = new Date(year, month, sub.date - 1, 9, 0, 0); // 오전 9시

    // 이미 지난 날짜면 다음 달로 예약
    if (notifyDate < now) {
      notifyDate = new Date(year, month + 1, sub.date - 1, 9, 0, 0);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${sub.name} 결제일 알림`,
        body: `${sub.name} 결제가 내일(${sub.date}일) 예정입니다.`,
        sound: true,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.CALENDAR,
        repeats: false,
        year: notifyDate.getFullYear(),
        month: notifyDate.getMonth() + 1, // JS: 0~11, expo: 1~12
        day: notifyDate.getDate(),
        hour: notifyDate.getHours(),
        minute: notifyDate.getMinutes(),
        second: 0,
      },
    });
  }
}
