import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getKeyHashAndroid,
  initializeKakaoSDK,
} from "@react-native-kakao/core";
import { login } from "@react-native-kakao/user";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
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

// 환경 변수 타입 체크
const supabaseUrl: string = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey: string = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Supabase 클라이언트 초기화
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// 카카오 토큰 타입 정의
interface KakaoOAuthToken {
  accessToken: string;
  refreshToken: string;
  idToken?: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
  scopes?: string[];
}

// 에러 타입 정의
interface KakaoError extends Error {
  code?: string;
}

const LoginScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // SDK 초기화를 useEffect로 이동
  useEffect(() => {
    const initKakao = async (): Promise<void> => {
      try {
        await initializeKakaoSDK("49ecca10f9378b80cf05c31563e5cc59");
      } catch (error) {
        console.error("Kakao SDK initialization failed:", error);
      }
    };

    initKakao();
  }, []);

  useEffect(() => {
    async function printKeyHash() {
      const keyHash = await getKeyHashAndroid();
      console.log("getKeyHashAndroid:", keyHash);
    }
    printKeyHash();
  }, []);

  // 세션 체크 후 자동 이동
  useEffect(() => {
    const checkSession = async (): Promise<void> => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
          return;
        }
        if (data?.session) {
          router.replace("/home");
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };
    checkSession();
  }, [router]);

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // 구글 로그인 로직 구현
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      router.replace("/home");
    } catch (error) {
      console.error("Google login error:", error);
      Alert.alert("오류", "구글 로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // 카카오 로그인 로직 구현
      const token = await login();
      console.log("Kakao token:", token);
      console.log("Kakao idToken:", token?.idToken);

      if (!token || !token.idToken) {
        console.error("Kakao login failed - no idToken:", token);
        Alert.alert(
          "로그인 오류",
          "카카오 ID 토큰을 받을 수 없습니다. 다시 시도해주세요."
        );
        return;
      }

      /* Supabase Auth */
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "kakao",
        token: token.idToken,
      });

      if (error) {
        console.error("Supabase auth error:", error);
        Alert.alert("로그인 오류", `인증 실패: ${error.message}`);
        return;
      }

      if (data?.user && data?.session) {
        console.log("Logged in user:", data);

        // 토큰 저장
        const { access_token, refresh_token } = data.session;
        if (access_token && refresh_token) {
          const saved = await saveTokens(access_token, refresh_token);

          if (!saved) {
            Alert.alert("오류", "토큰 저장에 실패했습니다.");
            return;
          }
        }

        router.replace("/home");
      }
    } catch (error) {
      console.error("Kakao login error:", error);
      let errorMessage = "카카오 로그인에 실패했습니다.";

      // 구체적인 에러 처리
      const kakaoError = error as KakaoError;
      if (kakaoError?.code === "AuthenticationCancelled") {
        errorMessage = "로그인이 취소되었습니다.";
      } else if (kakaoError?.code === "NotSupported") {
        errorMessage =
          "카카오 앱이 설치되지 않았습니다. 브라우저로 로그인을 시도해보세요.";
      } else if (kakaoError?.code === "NetworkError") {
        errorMessage = "네트워크 연결을 확인해주세요.";
      } else if (kakaoError?.message) {
        errorMessage = kakaoError.message;
      }

      Alert.alert("로그인 오류", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // 애플 로그인 로직 구현
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      Alert.alert("성공", "애플 로그인이 완료되었습니다.");
      router.replace("/home");
    } catch (error) {
      console.error("Apple login error:", error);
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
          {/* <TouchableOpacity
            style={[styles.socialButton, styles.googleButton]}
            onPress={handleGoogleLogin}
            disabled={isLoading}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="logo-google" size={24} color="#4285F4" />
              <Text style={styles.googleButtonText}>Google로 계속하기</Text>
            </View>
          </TouchableOpacity> */}

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
    paddingTop: 100,
    justifyContent: "center",
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
