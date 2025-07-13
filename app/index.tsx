import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeKakaoSDK } from "@react-native-kakao/core";
import { login } from "@react-native-kakao/user";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-url-polyfill/auto";
import { Colors } from "../styles/theme";
import { saveTokens } from "../utils/auth";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Supabase 클라이언트 초기화
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

const LoginScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  initializeKakaoSDK("49ecca10f9378b80cf05c31563e5cc59");

  // 세션 체크 후 자동 이동
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        router.replace("/home");
      }
    };
    checkSession();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      // 구글 로그인 로직 구현
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.replace("/home");
    } catch (error) {
      Alert.alert("오류", "구글 로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    try {
      setIsLoading(true);
      // 카카오 로그인 로직 구현
      const token = await login();
      console.log("Kakao token:", token.idToken);

      if (!token || !token.idToken) {
        Alert.alert("Login Error", "Failed to get Kakao ID token.");
        return;
      }

      /* Supabase Auth */
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "kakao",
        token: token.idToken,
      });

      if (error) {
        Alert.alert("Login Error", error.message);
        return;
      }

      if (data?.user) {
        console.log("Logged in user:", data);

        // 토큰 저장
        const { access_token, refresh_token } = data.session;
        const saved = await saveTokens(access_token, refresh_token);

        if (!saved) {
          Alert.alert("오류", "토큰 저장에 실패했습니다.");
          return;
        }

        router.replace("/home");
      }
    } catch (error) {
      Alert.alert("오류", "카카오 로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setIsLoading(true);
      // 애플 로그인 로직 구현
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert("성공", "애플 로그인이 완료되었습니다.");
      router.replace("/home");
    } catch (error) {
      Alert.alert("오류", "애플 로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.content,
          Platform.OS === "ios" ? { marginBottom: 50 } : { marginBottom: 100 },
        ]}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Image
            source={require("../assets/icon.png")}
            style={styles.logoContainer}
          />
        </View>

        {/* 소셜 로그인 버튼들 */}
        <View style={styles.socialContainer}>
          {/* 카카오 로그인 (한국에서 가장 보편적) */}
          <TouchableOpacity
            style={[styles.socialButton, styles.kakaoButton]}
            onPress={handleKakaoLogin}
            disabled={isLoading}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="chatbubble" size={24} color="#000000" />
              <Text style={styles.kakaoButtonText}>카카오로 계속하기</Text>
            </View>
          </TouchableOpacity>

          {/* 구글 로그인 */}
          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton]}
            onPress={handleGoogleLogin}
            disabled={isLoading}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="logo-google" size={24} color="#4285F4" />
              <Text style={styles.googleButtonText}>Google로 계속하기</Text>
            </View>
          </TouchableOpacity>

          {/* 애플 로그인 (iOS만 표시) */}
          {Platform.OS === "ios" && (
            <TouchableOpacity
              style={[styles.socialButton, styles.appleButton]}
              onPress={handleAppleLogin}
              disabled={isLoading}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="logo-apple" size={24} color="#ffffff" />
                <Text style={styles.appleButtonText}>Apple로 계속하기</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoContainer: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondary,
    textAlign: "center",
  },
  socialContainer: {
    paddingHorizontal: 16,
  },
  socialTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.value,
    textAlign: "center",
    marginBottom: 32,
  },
  socialButton: {
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 0,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  kakaoButton: {
    backgroundColor: "#FEE500",
  },
  kakaoButtonText: {
    color: "#000000",
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 12,
  },
  googleButton: {
    backgroundColor: "#F5F6F7",
  },
  googleButtonText: {
    color: "#333333",
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 12,
  },
  appleButton: {
    backgroundColor: "#000000",
  },
  appleButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 12,
  },
  termsContainer: {
    alignItems: "center",
  },
  termsText: {
    color: Colors.secondary,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.primary,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
