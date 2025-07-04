import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "@auth_token";
const REFRESH_TOKEN_KEY = "@refresh_token";

export const saveTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await AsyncStorage.multiSet([
      [AUTH_TOKEN_KEY, accessToken],
      [REFRESH_TOKEN_KEY, refreshToken],
    ]);
    return true;
  } catch (error) {
    console.error("Failed to save tokens:", error);
    return false;
  }
};

export const getTokens = async () => {
  try {
    const tokens = await AsyncStorage.multiGet([
      AUTH_TOKEN_KEY,
      REFRESH_TOKEN_KEY,
    ]);
    return {
      accessToken: tokens[0][1],
      refreshToken: tokens[1][1],
    };
  } catch (error) {
    console.error("Failed to get tokens:", error);
    return {
      accessToken: null,
      refreshToken: null,
    };
  }
};

export const removeTokens = async () => {
  try {
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY]);
    return true;
  } catch (error) {
    console.error("Failed to remove tokens:", error);
    return false;
  }
};
