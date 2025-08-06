import { FontAwesome, Ionicons } from "@expo/vector-icons";
import type { User } from "@supabase/supabase-js";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AdBanner from "../components/AdBanner";
import { Colors } from "../styles/theme";
import { supabase } from "../utils/subscription";

export default function SettingsPage() {
  const router = useRouter();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [checking, setChecking] = useState(true);

  // 실제 사용자 정보 상태
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    Notifications.getPermissionsAsync().then(({ status }) => {
      setIsNotificationEnabled(status === "granted");
      setChecking(false);
    });
    // 사용자 정보 가져오기
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
      setLoadingUser(false);
    };
    fetchUser();
  }, []);

  const handleToggleNotification = async () => {
    if (isNotificationEnabled) {
      Alert.alert("알림", "알림 권한 해제는 기기 설정에서만 가능합니다.");
      return;
    }
    const { status } = await Notifications.requestPermissionsAsync();
    setIsNotificationEnabled(status === "granted");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  // 이름 표시 로직 개선 (카카오 profile_nickname 우선)
  let displayName = "이름 없음";
  if (user) {
    displayName =
      user.user_metadata?.profile_nickname ||
      user.user_metadata?.name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.nickname ||
      (user.user_metadata?.email
        ? user.user_metadata.email.split("@")[0]
        : user.email
        ? user.email.split("@")[0]
        : undefined) ||
      "이름 없음";
  }

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* 메인 컨텐츠 */}
      <View style={styles.mainContent}>
        {/* 프로필 카드 */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            {user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  overflow: "hidden",
                  backgroundColor: "#e6f0ff",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{
                    uri:
                      user.user_metadata.avatar_url ||
                      user.user_metadata.picture,
                  }}
                  style={{ width: 56, height: 56, borderRadius: 28 }}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <FontAwesome name="user" size={32} color={Colors.primary} />
            )}
          </View>
          <View>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileEmail}>
              {user?.email || "이메일 없음"}
            </Text>
          </View>
        </View>

        {/* 내용 */}
        <View style={styles.content}>
          {/* 알림 카드 */}
          <View style={styles.sectionCard}>
            <View style={styles.row}>
              <Text style={styles.label}>알림 허용</Text>
              <Switch
                value={isNotificationEnabled}
                onValueChange={handleToggleNotification}
                disabled={checking}
                trackColor={{ false: "#e0e0e0", true: Colors.primary }}
                thumbColor={"#fff"}
              />
            </View>
          </View>

          {/* 로그아웃 버튼 */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </View>
      <AdBanner style={styles.adBanner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fb",
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#f8f9fb",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.value,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e6f0ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.value,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.secondary,
    marginTop: 2,
  },
  content: {
    flex: 1,
    width: "100%",
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    color: Colors.value,
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  adBanner: {
    width: '100%',
    marginBottom: 0,
  },
});
